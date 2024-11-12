<?php

namespace App\Entity;

use App\Repository\MlogEntryRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MlogEntryRepository::class)]
class MlogEntry
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['maintenance_log'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['maintenance_log'])]
    private ?string $guikey = null;

    #[ORM\ManyToOne(inversedBy: 'mlogEntries')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\ManyToOne(inversedBy: 'mlogEntries')]
    #[ORM\JoinColumn(nullable: false)]
    private ?MaintenanceLog $maintenanceLog = null;

    #[ORM\Column(type: Types::DATETIMETZ_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIMETZ_MUTABLE)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(length: 50)]
    #[Groups(['maintenance_log'])]
    private ?string $type = null;

    #[ORM\OneToOne(inversedBy: 'mlogEntry', cascade: ['persist', 'remove'])]
    #[Groups(['maintenance_log'])]
    private ?File $fileRelation = null;

    #[ORM\OneToOne(inversedBy: 'mlogEntry', cascade: ['persist', 'remove'])]
    #[Groups(['maintenance_log'])]
    private ?Event $eventRelation = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGuikey(): ?string
    {
        return $this->guikey;
    }

    public function setGuikey(string $guikey): static
    {
        $this->guikey = $guikey;

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

    public function getMaintenanceLog(): ?MaintenanceLog
    {
        return $this->maintenanceLog;
    }

    public function setMaintenanceLog(?MaintenanceLog $maintenanceLog): self
    {
        $this->maintenanceLog = $maintenanceLog;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getFileRelation(): ?File
    {
        return $this->fileRelation;
    }

    public function setFileRelation(?File $fileRelation): static
    {
        $this->fileRelation = $fileRelation;

        return $this;
    }

    public function getEventRelation(): ?Event
    {
        return $this->eventRelation;
    }

    public function setEventRelation(?Event $eventRelation): static
    {
        $this->eventRelation = $eventRelation;

        return $this;
    }

    public function getAssociatedObject()
    {
        return $this->type === 'file' ? $this->fileRelation : $this->eventRelation;
    }
}
