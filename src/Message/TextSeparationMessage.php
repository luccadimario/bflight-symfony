<?php

namespace App\Message;

final class TextSeparationMessage
{
    private $imageContent;
    private $box;
    private $fileuid;
    private $filename;

    public function __construct(string $imageContent, string $fileuid, array $box, string $filename)
    {
        $this->imageContent = $imageContent;
        $this->fileuid = $fileuid;
        $this->box = $box;
        $this->filename = $filename;
    }

    public function getImageContent(): string
    {
        return $this->imageContent;
    }

    public function getFileuid(): string
    {
        return $this->fileuid;
    }

    public function getBox(): array
    {
        return $this->box;
    }

    public function getFilename(): string
    {
        return $this->filename;
    }

}
