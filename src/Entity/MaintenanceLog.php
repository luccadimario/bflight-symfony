<?php

namespace App\Entity;

use App\Repository\MaintenanceLogRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;


#[ORM\Entity(repositoryClass: MaintenanceLogRepository::class)]
class MaintenanceLog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['maintenance_log'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'maintenanceLogs')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\Column(type: Types::DATETIMETZ_IMMUTABLE, nullable: false)]
    #[Groups(['maintenance_log'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['maintenance_log'])]
    private ?string $name = null;

    #[ORM\Column(type: 'text')]
    #[Groups(['maintenance_log'])]
    #[ORM\JoinColumn(nullable: true)]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'maintenanceLogs')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Plane $plane = null;

    #[ORM\OneToMany(mappedBy: 'maintenanceLog', targetEntity: MlogEntry::class, orphanRemoval: true)]
    #[Groups(['maintenance_log'])]
    private Collection $mlogEntries;

    #[ORM\OneToMany(mappedBy: 'maintenanceLog', targetEntity: File::class, orphanRemoval: true)]
    private Collection $files;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['maintenance_log'])]
    private $layout;

    public function __construct()
    {
        $this->mlogEntries = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPlane(): ?Plane
    {
        return $this->plane;
    }

    public function setPlane(?Plane $plane): self
    {
        $this->plane = $plane;

        return $this;
    }

    /**
     * @return Collection<int, MlogEntry>
     */
    public function getMlogEntries(): Collection
    {
        return $this->mlogEntries;
    }

    public function addMlogEntry(MlogEntry $mlogEntry): self
    {
        if (!$this->mlogEntries->contains($mlogEntry)) {
            $this->mlogEntries->add($mlogEntry);
            $mlogEntry->setMaintenanceLog($this);
        }

        return $this;
    }

    public function removeMlogEntry(MlogEntry $mlogEntry): self
    {
        if ($this->mlogEntries->removeElement($mlogEntry)) {
            // set the owning side to null (unless already changed)
            if ($mlogEntry->getMaintenanceLog() === $this) {
                $mlogEntry->setMaintenanceLog(null);
            }
        }

        return $this;
    }

    public function getLayout(): ?string
    {
        return $this->layout;
    }

    public function setLayout(?string $layout): self
    {
        $this->layout = $layout;
        return $this;
    }
}
