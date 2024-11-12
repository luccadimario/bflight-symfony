<?php

namespace App\Security;

use Doctrine\ORM\EntityManagerInterface;
use HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface;
use HWI\Bundle\OAuthBundle\Security\Core\User\OAuthAwareUserProviderInterface;
use App\Entity\User;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class Auth0UserProvider implements OAuthAwareUserProviderInterface, UserProviderInterface
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function loadUserByOAuthUserResponse(UserResponseInterface $response): User
    {
        $userData = $response->getData();
        $userID = $userData['sub'] ?? null;

        if (!$userID) {
            throw new \Exception('User identifier not found in Auth0 response');
        }

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['auth0Id' => $userID]);

        if (!$user) {
            $user = new User();
            $user->setAuth0Id($userID);
            $user->setEmail($userData['email'] ?? null);
            $user->setEmailVerified($userData['email_verified'] ?? false);
            $user->setNickname($userData['nickname'] ?? null);
            $user->setName($userData['name'] ?? null);
            $user->setPicture($userData['picture'] ?? null);
            $user->setDateCreated(new \DateTime());
            $user->setDateUpdated($userData['updated_at'] ? new \DateTime($userData['updated_at']) : new \DateTime());

            $this->entityManager->persist($user);
            $this->entityManager->flush();
        } else {
            if ($user->getDateUpdated() < new \DateTime($userData['updated_at'])) {
                $user->setEmail($userData['email'] ?? null);
                $user->setEmailVerified($userData['email_verified'] ?? false);
                $user->setNickname($userData['nickname'] ?? null);
                $user->setName($userData['name'] ?? null);
                $user->setPicture($userData['picture'] ?? null);
                $user->setDateUpdated($userData['updated_at'] ? new \DateTime($userData['updated_at']) : new \DateTime());

                $this->entityManager->persist($user);
                $this->entityManager->flush();
            }
        }

        return $user;
    }

    public function supportsClass($class): bool
    {
        return User::class === $class;
    }

    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        return $this->entityManager->getRepository(User::class)->findOneBy(['email' => $identifier]);
    }

    public function refreshUser(UserInterface $user): UserInterface
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException('Invalid user class ' . get_class($user));
        }

        return $this->loadUserByIdentifier($user->getUserIdentifier());
    }

    public function loadUserByUsername(string $username): UserInterface
    {
        return $this->loadUserByIdentifier($username);
    }
}
