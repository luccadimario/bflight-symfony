<?php

namespace App\Controller;

use App\Entity\File;
use App\Message\HandwrittenOcrMessage;
use App\Message\HeavyOcrSeparationMessage;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;

class OcrController extends AbstractController
{
    private $messageBus;
    private $entityManager;
    private $uploadDirectory;

    private $logger;

    public function __construct(MessageBusInterface $messageBus, EntityManagerInterface $entityManager, string $uploadDirectory, LoggerInterface $logger)
    {
        $this->messageBus = $messageBus;
        $this->entityManager = $entityManager;
        $this->uploadDirectory = $uploadDirectory;
        $this->logger = $logger;
    }

    #[Route('/heavyOcrSeparation', name: 'heavy_ocr_separation', methods: ['POST'])]
    public function index(Request $request): JsonResponse
    {
        $this->logger->info('Processing message', ['message' => '$message']);
        $guikey = $request->request->get('guikey');

        $uploadedFile = $request->files->get('image');

        if (!$uploadedFile) {
            return new JsonResponse(['status' => 'Image file is missing or invalid'], 400);
        }

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        $newFilename = $originalFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();

        // Move the file to the upload directory
        $uploadedFile->move($this->uploadDirectory, $newFilename);

        // Read the file contents
        $uploadedFilePath = $this->uploadDirectory . '/' . $newFilename;
        $imageContent = base64_encode(file_get_contents($uploadedFilePath));

        $file = new File();
        $file->setB64($imageContent);
        $file->setFilename($newFilename);
        $file->setGuikey($guikey);

        $this->entityManager->persist($file);
        $this->entityManager->flush();

        $requestData = [
            'filename' => $newFilename,
            'fileuid' => $file->getId()
        ];

        $message = new HandwrittenOcrMessage($requestData);

        try {
            $this->messageBus->dispatch($message);
        } catch (Exception $e) {
            return new JsonResponse(['status' => 'Failed to upload file'], 500);
        }

        return new JsonResponse(['status' => 'Message dispatched!', 'fileStatus' => 'New file created with an ID of ' . $file->getId()], 200);
    }
}
