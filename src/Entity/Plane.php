<?php

namespace App\Entity;

use App\Repository\PlaneRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PlaneRepository::class)]
class Plane
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['plane'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['plane'])]
    private ?string $friendly_name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['plane'])]
    private ?string $tail = null;

    #[ORM\Column]
    #[Groups(['plane'])]
    private ?bool $active = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['plane'])]
    private ?string $serial = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['plane'])]
    private ?string $icao = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['plane'])]
    private ?string $model = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['plane'])]
    private ?string $typeName = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['plane'])]
    private ?string $regowner = null;

    #[ORM\Column]
    #[Groups(['plane'])]
    private ?float $hours = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['plane'])]
    private ?array $plane_data = null;

    #[ORM\ManyToOne(inversedBy: 'planes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['plane'])]
    private ?string $cover_file = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['plane'])]
    private ?float $mileage = null;

    #[ORM\Column(type: Types::DATETIMETZ_MUTABLE, nullable: true)]
    #[Groups(['plane'])]
    private ?\DateTimeInterface $lastLogDate = null;

    #[ORM\Column(type: Types::DATETIMETZ_IMMUTABLE)]
    #[Groups(['plane'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIMETZ_MUTABLE, nullable: true)]
    #[Groups(['plane'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\OneToMany(mappedBy: 'plane', targetEntity: MaintenanceLog::class, orphanRemoval: true)]
    private Collection $maintenanceLogs;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['plane'])]
    private ?string $thumbnailPath = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['plane'])]
    private ?string $mediumPath = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['plane'])]
    private ?string $originalPath = null;


    public function __construct()
    {
        $this->maintenanceLogs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFriendlyName(): ?string
    {
        return $this->friendly_name;
    }

    public function setFriendlyName(?string $friendly_name): static
    {
        $this->friendly_name = $friendly_name;

        return $this;
    }

    public function getTail(): ?string
    {
        return $this->tail;
    }

    public function setTail(string $tail): static
    {
        $this->tail = $tail;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): static
    {
        $this->active = $active;

        return $this;
    }

    public function getSerial(): ?string
    {
        return $this->serial;
    }

    public function setSerial(?string $serial): static
    {
        $this->serial = $serial;

        return $this;
    }

    public function getIcao(): ?string
    {
        return $this->icao;
    }

    public function setIcao(?string $icao): static
    {
        $this->icao = $icao;

        return $this;
    }

    public function getModel(): ?string
    {
        return $this->model;
    }

    public function setModel(?string $model): static
    {
        $this->model = $model;

        return $this;
    }

    public function getTypeName(): ?string
    {
        return $this->typeName;
    }

    public function setTypeName(?string $typeName): static
    {
        $this->typeName = $typeName;

        return $this;
    }

    public function getRegowner(): ?string
    {
        return $this->regowner;
    }

    public function setRegowner(?string $regowner): static
    {
        $this->regowner = $regowner;

        return $this;
    }

    public function getHours(): ?float
    {
        return $this->hours;
    }

    public function setHours(float $hours): static
    {
        $this->hours = $hours;

        return $this;
    }

    public function getPlaneData(): ?array
    {
        return $this->plane_data;
    }

    public function setPlaneData(?array $plane_data): static
    {
        $this->plane_data = $plane_data;

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

    #[Groups(['plane'])]
    public function getOwnerId(): ?int
    {
        return $this->owner?->getId();
    }

    public function getCoverFile(): ?string
    {
        return $this->cover_file;
    }

    public function setCoverFile(?string $cover_file): static
    {
        $this->cover_file = $cover_file;

        return $this;
    }

    public function getMileage(): ?float
    {
        return $this->mileage;
    }

    public function setMileage(?float $mileage): static
    {
        $this->mileage = $mileage;

        return $this;
    }

    public function getLastLogDate(): ?\DateTimeInterface
    {
        return $this->lastLogDate;
    }

    public function setLastLogDate(?\DateTimeInterface $lastLogDate): static
    {
        $this->lastLogDate = $lastLogDate;

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

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection<int, MaintenanceLog>
     */
    public function getMaintenanceLogs(): Collection
    {
        return $this->maintenanceLogs;
    }

    public function addMaintenanceLog(MaintenanceLog $maintenanceLog): self
    {
        if (!$this->maintenanceLogs->contains($maintenanceLog)) {
            $this->maintenanceLogs->add($maintenanceLog);
            $maintenanceLog->setPlane($this);
        }

        return $this;
    }

    public function removeMaintenanceLog(MaintenanceLog $maintenanceLog): self
    {
        if ($this->maintenanceLogs->removeElement($maintenanceLog)) {
            // set the owning side to null (unless already changed)
            if ($maintenanceLog->getPlane() === $this) {
                $maintenanceLog->setPlane(null);
            }
        }

        return $this;
    }

    public function getThumbnailPath(): ?string
    {
        return $this->thumbnailPath;
    }

    public function setThumbnailPath(?string $thumbnailPath): self
    {
        $this->thumbnailPath = $thumbnailPath;
        return $this;
    }

    public function getMediumPath(): ?string
    {
        return $this->mediumPath;
    }

    public function setMediumPath(?string $mediumPath): self
    {
        $this->mediumPath = $mediumPath;
        return $this;
    }

    public function getOriginalPath(): ?string
    {
        return $this->originalPath;
    }

    public function setOriginalPath(?string $originalPath): self
    {
        $this->originalPath = $originalPath;
        return $this;
    }

    public function getImagePathBySize(string $size): ?string
    {
        return match ($size) {
            'thumbnail' => $this->getThumbnailPath(),
            'medium' => $this->getMediumPath(),
            'original' => $this->getOriginalPath(),
            default => null,
        };
    }

    public function setImagePathBySize(string $size, ?string $path): self
    {
        match ($size) {
            'thumbnail' => $this->setThumbnailPath($path),
            'medium' => $this->setMediumPath($path),
            'original' => $this->setOriginalPath($path),
            default => null,
        };
        return $this;
    }

}
