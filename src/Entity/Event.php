<?php

namespace App\Entity;

use App\Repository\EventRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: EventRepository::class)]
class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['maintenance_log'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['maintenance_log'])]
    private ?string $eventName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['maintenance_log'])]
    private ?string $eventCategory = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['maintenance_log'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['maintenance_log'])]
    private ?\DateTimeInterface $eventDate = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Groups(['maintenance_log'])]
    private ?File $mechCert = null;

    #[ORM\Column(length: 255)]
    #[Groups(['maintenance_log'])]
    private ?string $digitalSignature = null;

    #[ORM\OneToOne(mappedBy: 'eventRelation', cascade: ['persist', 'remove'])]
    #[Groups(['maintenance_log'])]
    private ?MlogEntry $mlogEntry = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEventName(): ?string
    {
        return $this->eventName;
    }

    public function setEventName(string $eventName): self
    {
        $this->eventName = $eventName;
        return $this;
    }

    public function getEventCategory(): ?string
    {
        return $this->eventCategory;
    }

    public function setEventCategory(string $eventCategory): self
    {
        $this->eventCategory = $eventCategory;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getEventDate(): ?\DateTimeInterface
    {
        return $this->eventDate;
    }

    public function setEventDate(\DateTimeInterface $eventDate): self
    {
        $this->eventDate = $eventDate;
        return $this;
    }

    public function getMechCert(): ?File
    {
        return $this->mechCert;
    }

    public function setMechCert(?File $mechCert): self
    {
        $this->mechCert = $mechCert;
        return $this;
    }

    public function getDigitalSignature(): ?string
    {
        return $this->digitalSignature;
    }

    public function setDigitalSignature(string $digitalSignature): self
    {
        $this->digitalSignature = $digitalSignature;
        return $this;
    }

    public function getMlogEntry(): ?MlogEntry
    {
        return $this->mlogEntry;
    }

    public function setMlogEntry(?MlogEntry $mlogEntry): self
    {
        // unset the owning side of the relation if necessary
        if ($mlogEntry === null && $this->mlogEntry !== null) {
            $this->mlogEntry->setEventRelation(null);
        }

        // set the owning side of the relation if necessary
        if ($mlogEntry !== null && $mlogEntry->getEventRelation() !== $this) {
            $mlogEntry->setEventRelation($this);
        }

        $this->mlogEntry = $mlogEntry;

        return $this;
    }
}
