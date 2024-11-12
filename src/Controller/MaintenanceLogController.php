<?php

namespace App\Controller;

use App\Entity\Event;
use App\Entity\MaintenanceLog;
use App\Entity\MlogEntry;
use App\Entity\Plane;
use App\Entity\File;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mime\MimeTypes;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class MaintenanceLogController extends AbstractController
{
    private LoggerInterface $logger;
    private string $uploadsDirectory;
    private string $previewsDirectory;
    private $slugger;

    public function __construct(LoggerInterface $logger, string $uploadsDirectory, string $previewsDirectory, SluggerInterface $slugger)
    {
        $this->logger = $logger;
        $this->uploadsDirectory = $uploadsDirectory;
        $this->previewsDirectory = $previewsDirectory;
        $this->slugger = $slugger;
    }

    #[Route('/api/mlog/create/{planeId}', name: 'create_mlog', methods: ['POST'])]
    public function createMlog(Request $request, int $planeId, EntityManagerInterface $entityManager): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $data = json_decode($request->getContent(), true);
        $name = $data['name'] ?? null;
        $description = $data['description'] ?? null;

        if (!$name) {
            return $this->json(['error' => 'Maintenance log name is required'], 400);
        }

        $plane = $entityManager->getRepository(Plane::class)->find($planeId);
        if (!$plane) {
            return $this->json(['error' => 'Plane not found'], 404);
        }

        $mlog = new MaintenanceLog();
        $mlog->setOwner($user);
        $mlog->setName($name);
        $mlog->setDescription($description);
        $mlog->setPlane($plane);
        $mlog->setDate(new \DateTimeImmutable());

        $entityManager->persist($mlog);
        $entityManager->flush();

        return $this->json([
            'id' => $mlog->getId(),
            'name' => $mlog->getName(),
            'description' => $mlog->getDescription(),
            'date' => $mlog->getDate()->format('Y-m-d H:i:s'),
        ], 201);
    }

    #[Route('/api/mlog/{mlogId}/add-file', name: 'add_file_to_mlog', methods: ['POST'])]
    public function addFileToMlog(
        Request $request,
        int $mlogId,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger,
    ): JsonResponse {

        $this->denyAccessUnlessGranted('ROLE_USER');

        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $mlog = $entityManager->getRepository(MaintenanceLog::class)->find($mlogId);
        if (!$mlog) {
            return $this->json(['error' => 'Maintenance log not found'], 404);
        }

        /** @var UploadedFile $uploadedFile */
        $uploadedFile = $request->files->get('file');
        if (!$uploadedFile) {
            $this->logger->error('No file uploaded');
            return $this->json(['error' => 'No file uploaded2'], 400);
        }

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();

        try {
            $uploadedFile->move($this->uploadsDirectory, $newFilename);
            $filePath = $this->uploadsDirectory . '/' . $newFilename;

            // Get MIME type after moving the file
            $mimeType = mime_content_type($filePath);

            $previewFilename = $this->generatePreview($filePath);
        } catch (FileException $e) {
            $this->logger->error('Failed to upload file', ['error' => $e->getMessage()]);
            return $this->json(['error' => 'Failed to upload file'], 500);
        } catch (\Exception $e) {
            $this->logger->error('Failed to generate preview', ['error' => $e->getMessage()]);
            $previewFilename = 'default-preview.jpg';
        }

        $file = new File();
        $file->setOwner($user);
        $file->setFilename($originalFilename);
        $file->setUniqueFilename($newFilename);
        $file->setFilepath($filePath);
        $file->setPreview($previewFilename);
        $file->setMaintenanceLog($mlog);

        $mlogEntry = new MlogEntry();
        $mlogEntry->setOwner($user);
        $mlogEntry->setMaintenanceLog($mlog);
        $mlogEntry->setGuikey(uniqid());
        $mlogEntry->setType('file');
        $mlogEntry->setFileRelation($file);
        $mlogEntry->setCreatedAt(new \DateTimeImmutable());
        $mlogEntry->setUpdatedAt(new \DateTime());

        $entityManager->persist($file);
        $entityManager->persist($mlogEntry);
        $entityManager->flush();

        return $this->json([
            'id' => $mlogEntry->getFileRelation()->getId(),
            'guikey' => $mlogEntry->getGuikey(),
            'filename' => $file->getFilename(),
            'type' => 'file',
            'mimeType' => $mimeType,
        ], 201);
    }

    #[Route('/api/mlog/{mlogId}/add-event', name: 'add_event_to_mlog', methods: ['POST'])]
    public function addEventToMlog(
        Request $request,
        int $mlogId,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger,
        LoggerInterface $logger,
    ): JsonResponse {
        $this->denyAccessUnlessGranted('ROLE_USER');

        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $mlog = $entityManager->getRepository(MaintenanceLog::class)->find($mlogId);
        if (!$mlog) {
            return $this->json(['error' => 'Maintenance log not found'], 404);
        }

        $eventName = $request->request->get('eventName');
        $eventCategory = $request->request->get('eventCategory');
        $description = $request->request->get('description');
        $eventDate = $request->request->get('eventDate');
        $digitalSignature = $request->request->get('digitalSignature');

        // Validate required fields
        $requiredFields = ['eventName', 'eventCategory', 'description', 'eventDate', 'digitalSignature'];
        foreach ($requiredFields as $field) {
            if (empty($$field)) {
                $logger->error('Missing required field', ['field' => $field]);
                return $this->json(['error' => "Missing required field: $field"], 400);
            }
        }

        $event = new Event();
        $event->setEventName($eventName);
        $event->setEventCategory($eventCategory);
        $event->setDescription($description);
        $event->setEventDate(new \DateTime($eventDate));
        $event->setDigitalSignature($digitalSignature);

        // Handle file upload for mechanic certificate
        if ($request->files->has('mechCert')) {
            $uploadedFile = $request->files->get('mechCert');
            if ($uploadedFile) {
                $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();

                try {
                    $uploadedFile->move($this->uploadsDirectory, $newFilename);
                    $filePath = $this->uploadsDirectory . '/' . $newFilename;

                    // Get MIME type after moving the file
                    $mimeType = mime_content_type($filePath);

                    $previewFilename = $this->generatePreview($filePath);

                    $file = new File();
                    $file->setOwner($user);
                    $file->setFilename($originalFilename);
                    $file->setUniqueFilename($newFilename);
                    $file->setFilepath($filePath);
                    $file->setPreview($previewFilename);
                    $file->setMaintenanceLog($mlog);

                    $entityManager->persist($file);
                    $event->setMechCert($file);
                } catch (FileException $e) {
                    $logger->error('Failed to upload file', ['error' => $e->getMessage()]);
                    return $this->json(['error' => 'Failed to upload file'], 500);
                } catch (\Exception $e) {
                    $logger->error('Failed to generate preview', ['error' => $e->getMessage()]);
                    // Handle the error as needed
                }
            }
        }

        $mlogEntry = new MlogEntry();
        $mlogEntry->setOwner($user);
        $mlogEntry->setMaintenanceLog($mlog);
        $mlogEntry->setGuikey(uniqid());
        $mlogEntry->setType('event');
        $mlogEntry->setEventRelation($event);
        $mlogEntry->setCreatedAt(new \DateTimeImmutable());
        $mlogEntry->setUpdatedAt(new \DateTime());

        $entityManager->persist($event);
        $entityManager->persist($mlogEntry);
        $entityManager->flush();

        return $this->json([
            'id' => $mlogEntry->getId(),
            'guikey' => $mlogEntry->getGuikey(),
            'type' => 'event',
            'event'=> [
                'id' => $mlogEntry->getEventRelation()->getId(),
                'name' => $mlogEntry->getEventRelation()->getEventName(),
                'category' => $mlogEntry->getEventRelation()->getEventCategory(),
                'description' => $mlogEntry->getEventRelation()->getDescription(),
                'mechCert' => [
                    'id' => $mlogEntry->getEventRelation()->getMechCert()->getId(),
                    'filename' => $mlogEntry->getEventRelation()->getMechCert()->getFilename(),
                    'type' => $mimeType,
                ],
                'digitalSignature' => $mlogEntry->getEventRelation()->getDigitalSignature(),
            ],
        ], 201);

    }


    private function generatePreview(string $filepath): string
    {
        $mime = mime_content_type($filepath);
        $originalFilename = pathinfo($filepath, PATHINFO_FILENAME);
        $previewFilename = 'preview_' . uniqid() . '_' . $originalFilename . '.jpg';
        $previewPath = $this->previewsDirectory . '/' . $previewFilename;

        $this->logger->info('Generating preview', [
            'original_file' => $filepath,
            'preview_file' => $previewPath,
            'mime_type' => $mime
        ]);

        try {
            if (strpos($mime, 'image/') === 0) {
                $image = new \Imagick($filepath);
                $image->thumbnailImage(300, 300, true, true);
                $image->setImageFormat('jpg');
                $image->writeImage($previewPath);
                $image->clear();
            } elseif ($mime === 'application/pdf') {
                $image = new \Imagick();
                $image->setResolution(300, 300);
                $image->readImage($filepath . '[0]');
                $image->setImageFormat('jpg');
                $image->thumbnailImage(300, 300, true, true);
                $image->writeImage($previewPath);
                $image->clear();
            } else {
                throw new \Exception("Unsupported file type: $mime");
            }

            return $previewFilename;
        } catch (\Exception $e) {
            $this->logger->error('Preview generation failed', [
                'error' => $e->getMessage(),
                'file' => $filepath,
            ]);
            throw $e;
        }
    }

    #[Route('/serve-previews/{id}', name: 'serve_preview', methods: ['GET'])]
    public function servePreview(File $file): BinaryFileResponse
    {
        if ($file->getOwner() !== $this->getUser()) {
            throw $this->createAccessDeniedException('You do not have permission to access this plane');
        }

        $filePath = $this->getParameter('file_previews_directory') . '/' . $file->getPreview();

        if (!file_exists($filePath)) {
            throw new NotFoundHttpException('Preview image not found');
        }

        return new BinaryFileResponse($filePath);
    }


    #[Route('/api/save-layout', name: 'save_layout', methods: ['POST'])]
    public function saveLayout(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $mlogId = $data['mlogId'];
        $layout = $data['layout'];

        $mlog = $em->getRepository(MaintenanceLog::class)->find($mlogId);
        if (!$mlog) {
            return $this->json(['error' => 'Maintenance Log not found'], 404);
        }

        $mlog->setLayout(json_encode($layout));
        $em->flush();

        return $this->json(['message' => 'Layout saved to database']);
    }



}
