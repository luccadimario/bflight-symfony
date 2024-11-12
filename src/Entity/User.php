<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['plane'])]
    private ?int $id = null;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Plane::class, orphanRemoval: true)]
    private Collection $planes;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: MaintenanceLog::class, orphanRemoval: true)]
    private Collection $maintenanceLogs;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: MlogEntry::class, orphanRemoval: true)]
    private Collection $mlogEntries;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: File::class, orphanRemoval: true)]
    private Collection $files;

    #[ORM\Column(length: 255, unique: true, nullable: true)]
    private ?string $auth0Id = null;

    #[ORM\Column(length: 180, unique: true, nullable: true)]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column(type: 'boolean')]
    private bool $emailVerified = false;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $nickname = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $picture = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $dateCreated = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $dateUpdated = null;

    public function __construct()
    {
        $this->planes = new ArrayCollection();
        $this->maintenanceLogs = new ArrayCollection();
        $this->mlogEntries = new ArrayCollection();
        $this->files = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Plane>
     */
    public function getPlanes(): Collection
    {
        return $this->planes;
    }

    public function addPlane(Plane $plane): self
    {
        if (!$this->planes->contains($plane)) {
            $this->planes->add($plane);
            $plane->setOwner($this);
        }

        return $this;
    }

    public function removePlane(Plane $plane): self
    {
        if ($this->planes->removeElement($plane)) {
            // set the owning side to null (unless already changed)
            if ($plane->getOwner() === $this) {
                $plane->setOwner(null);
            }
        }

        return $this;
    }

    public function getAuth0Id(): ?string
    {
        return $this->auth0Id;
    }

    public function setAuth0Id(?string $auth0Id): self
    {
        $this->auth0Id = $auth0Id;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getEmailVerified(): bool
    {
        return $this->emailVerified;
    }

    public function setEmailVerified(bool $emailVerified): self
    {
        $this->emailVerified = $emailVerified;
        return $this;
    }

    public function getNickname(): ?string
    {
        return $this->nickname;
    }

    public function setNickname(?string $nickname): self
    {
        $this->nickname = $nickname;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(?string $picture): self
    {
        $this->picture = $picture;
        return $this;
    }

    public function getDateCreated(): ?\DateTimeInterface
    {
        return $this->dateCreated;
    }

    public function setDateCreated(\DateTimeInterface $dateCreated): self
    {
        $this->dateCreated = $dateCreated;
        return $this;
    }

    public function getDateUpdated(): ?\DateTimeInterface
    {
        return $this->dateUpdated;
    }

    public function setDateUpdated(?\DateTimeInterface $dateUpdated): self
    {
        $this->dateUpdated = $dateUpdated;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
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
            $mlogEntry->setOwner($this);
        }

        return $this;
    }

    public function removeMlogEntry(MlogEntry $mlogEntry): self
    {
        if ($this->mlogEntries->removeElement($mlogEntry)) {
            // set the owning side to null (unless already changed)
            if ($mlogEntry->getOwner() === $this) {
                $mlogEntry->setOwner(null);
            }
        }

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
            $maintenanceLog->setOwner($this);
        }

        return $this;
    }

    public function removeMaintenanceLog(MaintenanceLog $maintenanceLog): self
    {
        if ($this->maintenanceLogs->removeElement($maintenanceLog)) {
            // set the owning side to null (unless already changed)
            if ($maintenanceLog->getOwner() === $this) {
                $maintenanceLog->setOwner(null);
            }
        }

        return $this;
    }
    /**
     * @return Collection<int, File>
     */
    public function getFiles(): Collection
    {
        return $this->files;
    }

    public function addFile(File $file): self
    {
        if (!$this->files->contains($file)) {
            $this->files->add($file);
            $file->setOwner($this);
        }

        return $this;
    }

    public function removeFile(File $file): self
    {
        if ($this->files->removeElement($file)) {
            // set the owning side to null (unless already changed)
            if ($file->getOwner() === $this) {
                $file->setOwner(null);
            }
        }

        return $this;
    }
}
