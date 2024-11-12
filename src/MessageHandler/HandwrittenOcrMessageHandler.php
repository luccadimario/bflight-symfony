<?php

namespace App\MessageHandler;

use App\Message\HandwrittenOcrMessage;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\DetectedWords;
use Psr\Log\LoggerInterface;

#[AsMessageHandler]
final class HandwrittenOcrMessageHandler
{
    private $entityManager;
    private $venvActivate = '/Users/luccadimario/PyOcr/bin/activate';
    private $scriptPath = '/Users/luccadimario/ocr_handwritten.py';
    private $logger;

    public function __construct(EntityManagerInterface $entityManager, LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->logger = $logger;
    }

    public function __invoke(HandwrittenOcrMessage $message)
    {
        $imageContent = $message->getImageContent();
        $box = $message->getBox();
        $fileuid = $message->getFileuid();
        $filename = $message->getFilename();

        // Execute the new Python script
        $command = "source " . escapeshellarg($this->venvActivate) . " && python3 " . escapeshellarg($this->scriptPath) . " " . escapeshellarg($filename);
        $output = shell_exec($command);

        $this->logger->info('Python Output', ['Output' => $output]);

        if ($output === null) {
            // Handle the error (log it, retry, etc.)
            return;
        }

        /*$result = json_decode($output, true);

        if ($result === null || $result['status'] !== 'success') {
            // Handle the error (log it, retry, etc.)
            return;
        }*/

        $detectedWord = new DetectedWords();
        $detectedWord->setFileuid($fileuid);
        $this->logger->info('DATA', ['Fileuid' => $fileuid]);
        $detectedWord->setWord($output);
        $this->logger->info('DATA', ['Word' => $output]);

        $boxCoordinatesJson = json_encode($box);

        $this->logger->info('DATA', ['Box Coordinates' => $boxCoordinatesJson]);

        $detectedWord->setBoxCoordinates($boxCoordinatesJson);

        $this->entityManager->persist($detectedWord);
        $this->entityManager->flush();

        $this->logger->info('COMPLETED', ['Status' => $detectedWord->getId()]);

        unlink($filename);


    }
}
