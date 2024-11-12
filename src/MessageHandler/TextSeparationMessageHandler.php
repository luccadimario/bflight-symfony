<?php

namespace App\MessageHandler;

use App\Message\TextSeparationMessage;
use App\Message\HandwrittenOcrMessage;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Exception\ExceptionInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Psr\Log\LoggerInterface;


#[AsMessageHandler]
final class TextSeparationMessageHandler
{

    private $messageBus;
    private $venvActivate = '/Users/luccadimario/PyOcr/bin/activate';
    private $scriptPath = '/Users/luccadimario/easy_ocr_craft.py';
    private $uploadDirectory;

    private $logger;

    public function __construct(MessageBusInterface $messageBus, string $uploadDirectory, LoggerInterface $logger)
    {
        $this->messageBus = $messageBus;
        $this->uploadDirectory = $uploadDirectory;
        $this->logger = $logger;
    }

    public function __invoke(TextSeparationMessage $message)
    {
        $this->logger->info('Processing message', ['message' => $message]);

        $requestData = $message->getRequestData();
        $fileuid = $requestData['fileuid'];

        $uploadedImagePath = $this->uploadDirectory . '/' . $requestData['filename'];
        $outputDirectory = $this->uploadDirectory . '/output';

        $this->logger->info('Python Location', ['Upload Path' => $uploadedImagePath, 'Output Location' => $outputDirectory]);

        // Construct the command to run the script in the virtual environment
        $command = "source " . escapeshellarg($this->venvActivate) . " && python3 " . escapeshellarg($this->scriptPath) . " " . escapeshellarg($uploadedImagePath) . " " . escapeshellarg($outputDirectory);

        // Execute the command and capture the output
        $output = shell_exec($command);

        $this->logger->info('Python Output', ['Output' => $output]);

        if ($output === null) {
            $this->logger->info('Python Output Null Check', ['Output' => null]);
            return;
        }

        // Decode the JSON output from the Python script
        $boxInfo = json_decode($output, true);

        if ($boxInfo === null) {
            // Handle the error (log it, retry, etc.)
            return;
        }

        // Process the returned box information
        foreach ($boxInfo as $info) {
            $filename = $info['filename'];
            $box = $info['box'];
            $imageContent = base64_encode(file_get_contents($filename)); // Read the file content and encode it

            $boxMessage = new HandwrittenOcrMessage($imageContent, $fileuid, $box, $filename);
            try {
                $this->messageBus->dispatch($boxMessage);
            } catch (ExceptionInterface $e) {
            }

        }

        // Clean up the uploaded image
        unlink($uploadedImagePath);

        $this->logger->info('Finished processing message');
    }
}
