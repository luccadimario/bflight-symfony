<?php

namespace App\Service;

use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\User\UserInterface;

class UserManagement
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function getCurrentUser(): ?UserInterface
    {
        return $this->security->getUser();
    }

    public function getUserData(): ?array
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            return null;
        }

    // Assuming Auth0 provides these fields. Adjust as necessary.
        return [
        'id' => $user->getAuth0Id(),
        'email' => $user->getEmail(),
        'name' => $user->getName(),
        'nickname' => $user->getNickname(),
        'picture' => $user->getPicture(),
        // Add any other fields you need
        ];
    }
}
