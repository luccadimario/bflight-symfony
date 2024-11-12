<?php

namespace App\Entity;

use App\Repository\FileRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FileRepository::class)]
class File
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['maintenance_log'])]
    private ?int $id = null;


    #[ORM\Column(length: 255)]
    #[Groups(['maintenance_log'])]
    private ?string $filename = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $uniqueFilename = null;

    #[ORM\Column(type: Types::TEXT, nullable: false)]
    private ?string $filePath = null;

    #[ORM\ManyToOne(inversedBy: 'files')]
    #[ORM\JoinColumn(nullable: true)]
    private ?MaintenanceLog $maintenanceLog = null;

    #[ORM\ManyToOne(inversedBy: 'files')]
    #[ORM\JoinColumn(nullable: true)]
    private ?User $owner = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $preview = null;

    #[ORM\OneToOne(mappedBy: 'fileRelation', cascade: ['persist', 'remove'])]
    private ?MlogEntry $mlogEntry = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(string $filename): static
    {
        $this->filename = $filename;

        return $this;
    }

    public function getUniqueFilename(): ?string
    {
        return $this->uniqueFilename;
    }

    public function setUniqueFilename(string $uniqueFilename): static
    {
        $this->uniqueFilename = $uniqueFilename;

        return $this;
    }

    public function getFilePath(): ?string
    {
        return $this->filePath;
    }

    public function setFilePath(?string $filePath): static
    {
        $this->filePath = $filePath;

        return $this;
    }

    public function getMaintenanceLog(): ?MaintenanceLog
    {
        return $this->maintenanceLog;
    }

    public function setMaintenanceLog(?MaintenanceLog $maintenanceLog): self
    {
        $this->maintenanceLog = $maintenanceLog;

        return $this;
    }

    public function getPreview(): ?string
    {
        return $this->preview;
    }

    public function setPreview(?string $preview): self
    {
        $this->preview = $preview;
        return $this;
    }

    public function getMlogEntry(): ?MlogEntry
    {
        return $this->mlogEntry;
    }

    public function setMlogEntry(?MlogEntry $mlogEntry): static
    {
        // unset the owning side of the relation if necessary
        if ($mlogEntry === null && $this->mlogEntry !== null) {
            $this->mlogEntry->setFileRelation(null);
        }

        // set the owning side of the relation if necessary
        if ($mlogEntry !== null && $mlogEntry->getFileRelation() !== $this) {
            $mlogEntry->setFileRelation($this);
        }

        $this->mlogEntry = $mlogEntry;

        return $this;
    }
    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }


}
