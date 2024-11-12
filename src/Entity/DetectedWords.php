<?php

namespace App\Entity;

use App\Repository\DetectedWordsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DetectedWordsRepository::class)]
class DetectedWords
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $fileuid = null;

    #[ORM\Column(length: 255)]
    private ?string $word = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $boxCoordinates = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFileuid(): ?string
    {
        return $this->fileuid;
    }

    public function setFileuid(string $fileuid): static
    {
        $this->fileuid = $fileuid;

        return $this;
    }

    public function getWord(): ?string
    {
        return $this->word;
    }

    public function setWord(string $word): static
    {
        $this->word = $word;

        return $this;
    }

    public function getBoxCoordinates(): ?string
    {
        return $this->boxCoordinates;
    }

    public function setBoxCoordinates(string $boxCoordinates): static
    {
        $this->boxCoordinates = $boxCoordinates;

        return $this;
    }
}
