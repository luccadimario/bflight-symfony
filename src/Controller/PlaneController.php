<?php

namespace App\Controller;

use App\Entity\Plane;
use App\Entity\User;
use App\Repository\PlaneRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;

#[Route('/api/planes', name: 'api_planes_')]
class PlaneController extends AbstractController
{
    private $entityManager;
    private $serializer;
    private $planeRepository;
    private $slugger;
    private $planeUploadsDirectory;
    private $imageManager;

    public function __construct(
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer,
        PlaneRepository $planeRepository,
        SluggerInterface $slugger,
        string $planeUploadsDirectory
    ) {
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
        $this->planeRepository = $planeRepository;
        $this->slugger = $slugger;
        $this->planeUploadsDirectory = $planeUploadsDirectory;
        $this->imageManager = new ImageManager(new GdDriver());
    }


    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $data = json_decode($request->getContent(), true);

        $plane = new Plane();
        $plane->setOwner($user);
        $plane->setFriendlyName($data['friendly_name'] ?? null);
        $plane->setTail($data['tail']);
        $plane->setActive($data['active'] ?? true);
        $plane->setSerial($data['serial'] ?? null);
        $plane->setIcao($data['icao'] ?? null);
        $plane->setModel($data['model'] ?? null);
        $plane->setTypeName($data['typeName'] ?? null);
        $plane->setRegowner($data['regowner'] ?? null);
        $plane->setHours($data['hours'] ?? 0);
        $plane->setPlaneData($data['plane_data'] ?? null);
        $plane->setMileage($data['mileage'] ?? null);
        $plane->setLastLogDate(isset($data['lastLogDate']) ? new \DateTime($data['lastLogDate']) : null);
        $plane->setCreatedAt(new \DateTimeImmutable());
        $plane->setUpdatedAt(new \DateTime());

        $this->entityManager->persist($plane);
        $this->entityManager->flush();

        $jsonPlane = $this->serializer->serialize($plane, 'json', ['groups' => 'plane']);
        return new JsonResponse($jsonPlane, 201, [], true);
    }

    #[Route('/{id}/file-count', name: 'file_count', methods: ['GET'])]
    public function getFileCount(Plane $plane): JsonResponse
    {
        if ($plane->getOwner() !== $this->getUser()) {
            throw $this->createAccessDeniedException('You do not have permission to access this plane');
        }

        try {
            $fileCount = $this->planeRepository->getTotalFilesCount($plane);
            return $this->json(['fileCount' => $fileCount]);
        } catch (\Exception $e) {
            return $this->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    #[Route('/plane-image/{id}/{size}', name: 'api_plane_image', methods: ['GET'])]
    public function getPlaneImage(Plane $plane, string $size): JsonResponse
    {
        if ($plane->getOwner() !== $this->getUser()) {
            throw $this->createAccessDeniedException('You do not have permission to access this plane');
        }

        $imagePath = $this->getImagePathBySize($plane, $size);
        if (!$imagePath) {
            return $this->json(['imageExists' => false, 'message' => 'No image found for this plane'], 404);
        }

        $fullPath = $this->planeUploadsDirectory . '/' . $imagePath;
        if (!file_exists($fullPath)) {
            return $this->json(['imageExists' => false, 'message' => 'Image file not found on server'], 404);
        }

        return $this->json([
            'imageExists' => true,
            'imageUrl' => $this->generateUrl('api_planes_serve_image', [
                'id' => $plane->getId(),
                'size' => $size
            ])
        ]);
    }

    #[Route('/serve-image/{id}/{size}', name: 'serve_image', methods: ['GET'])]
    public function serveImage(Plane $plane, string $size): BinaryFileResponse
    {
        if ($plane->getOwner() !== $this->getUser()) {
            throw $this->createAccessDeniedException('You do not have permission to access this plane');
        }

        $imagePath = $this->getImagePathBySize($plane, $size);
        if (!$imagePath) {
            throw $this->createNotFoundException('Image not found');
        }

        $fullPath = $this->planeUploadsDirectory . '/' . $imagePath;
        if (!file_exists($fullPath)) {
            throw $this->createNotFoundException('Image file not found on server');
        }

        return new BinaryFileResponse($fullPath);
    }

    #[Route('/upload-image/{id}', name: 'api_plane_upload_image', methods: ['POST'])]
    public function uploadPlaneImage(Request $request, Plane $plane): JsonResponse
    {
        if ($plane->getOwner() !== $this->getUser()) {
            throw $this->createAccessDeniedException('You do not have permission to access this plane');
        }

        /** @var UploadedFile $imageFile */
        $imageFile = $request->files->get('image');

        if (!$imageFile) {
            throw new BadRequestHttpException('"image" is required');
        }

        $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $newFilename = $safeFilename.'-'.uniqid();
        $originalExtension = $imageFile->guessExtension() ?? 'png';

        $sizes = [
            'original' => null,
            'medium' => 800,
            'thumbnail' => 200
        ];

        $paths = [];

        foreach ($sizes as $size => $width) {
            $image = $this->imageManager->read($imageFile->getPathname());

            if ($width) {
                $image->resize($width, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }

            $sizeFilename = $newFilename . '-' . $size . '.' . $originalExtension;
            $path = $this->planeUploadsDirectory . '/' . $sizeFilename;

            $image->save($path);

            $paths[$size] = $sizeFilename;
        }

        $plane->setOriginalPath($paths['original']);
        $plane->setMediumPath($paths['medium']);
        $plane->setThumbnailPath($paths['thumbnail']);

        $this->entityManager->persist($plane);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Images uploaded and processed successfully',
            'paths' => $paths
        ]);
    }

    private function getImagePathBySize(Plane $plane, string $size): ?string
    {
        return match ($size) {
            'thumbnail' => $plane->getThumbnailPath(),
            'medium' => $plane->getMediumPath(),
            'original' => $plane->getOriginalPath(),
            default => throw new BadRequestHttpException('Invalid size parameter'),
        };
    }
}
