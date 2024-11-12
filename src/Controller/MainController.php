<?php
// src/Controller/MainController.php
namespace App\Controller;

use App\Repository\MaintenanceLogRepository;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Repository\PlaneRepository;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Notifier\TexterInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Service\UserManagement;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class MainController extends AbstractController
{
    private $userManagement;

    public function __construct(UserManagement $userManagement)
    {
        $this->userManagement = $userManagement;
    }
    #[Route('/', 'index')]
    public function index(Request $request): Response {
        $userData = $this->userManagement->getUserData();
        return $this->render('home.html.twig', [
            'userData' => $userData,
        ]);
    }
    #[Route('about', 'about')]
    public function about(Request $request): Response {
        return $this->render('about.html.twig');
    }

    #[Route('home', 'homeRedirect')]
    public function home(Request $request): Response {
        return $this->render('home.html.twig');
    }

    #[Route('dashboard', 'dashboard')]
    public function dashboard(Request $request, PlaneRepository $planeRepository, SerializerInterface $serializer, NormalizerInterface $normalizer): Response {
        $user = $this->getUser();
        $planes = [];

        if ($user) {
            $planes = $planeRepository->findBy(['owner' => $user]);
            $userData = $this->userManagement->getUserData();
        }

        // Serialize to array instead of JSON string
        $normalizedPlanes = $normalizer->normalize($planes, null, [
            'groups' => 'plane',
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]);
        //echo json_encode($normalizedPlanes, JSON_PRETTY_PRINT);
        //exit;

        return $this->render('dashboard.html.twig', [
            'planes' => $normalizedPlanes,
            'userData' => $userData,
        ]);


    }

    #[Route('ocr', 'ocr')]
    public function ocr(Request $request): Response {
        return $this->render('ocr.html.twig');
    }

    #[Route('user/dashboard', 'userDashboard')]
    public function account_dash(Request $request): Response {
        return $this->render('account.html.twig');
    }

    #[Route('/dashboard/logs/{planeID}', 'fileUpload')]
        public function file_upload(Request $request, int $planeID, PlaneRepository $planeRepository, MaintenanceLogRepository $maintenanceLogRepository, NormalizerInterface $normalizer, LoggerInterface $logger): Response {
            $user = $this->getUser();
            $plane = $planeRepository->findOneBy(['id' => $planeID, 'owner' => $user]);

            if (!$plane) {
                throw $this->createNotFoundException('Plane not found or you do not have permission to view it.');
            }

            $maintenanceLogs = $maintenanceLogRepository->findBy(['plane' => $plane]);

            $normalizedPlane = $normalizer->normalize($plane, null, ['groups' => 'plane']);
            $normalizedLogs = $normalizer->normalize($maintenanceLogs, null, [
                'groups' => 'maintenance_log',
                'circular_reference_handler' => function ($object) {
                    return $object->getId();
                }
            ]);



            return $this->render('file_upload.html.twig', [
                'planeData' => $normalizedPlane,
                'initialMaintenanceLogs' => $normalizedLogs,
            ]);
        }

    #[Route('logSpreadsheet/{fileID}', 'logSpreadsheet')]
        public function log_spreadsheet(Request $request, string $fileID): Response {
            return $this->render('log_spreadsheet.html.twig', ['fileID' => $fileID]);
        }

    #[Route('ocrView/{fileID}', 'ocrView')]
        public function ocr_view(Request $request, string $fileID): Response {
            return $this->render('ocr_view.html.twig', ['fileID' => $fileID]);
        }

    #[Route('pricing', 'pricing')]
        public function pricing(Request $request): Response {
            return $this->render('pricing.html.twig');
        }

    #[Route('dashboard/plane/{planeID}', 'planeInfo')]
    public function plane_info(Request $request, string $planeID): Response {
        // Check if user is authenticated to view this! For sprint 3 :D
        return $this->render('plane_info.html.twig', ['planeID' => $planeID]);
    }
}