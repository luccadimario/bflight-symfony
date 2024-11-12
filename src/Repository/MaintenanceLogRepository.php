<?php

namespace App\Repository;

use App\Entity\MaintenanceLog;
use App\Entity\Plane;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MaintenanceLog>
 *
 * @method MaintenanceLog|null find($id, $lockMode = null, $lockVersion = null)
 * @method MaintenanceLog|null findOneBy(array $criteria, array $orderBy = null)
 * @method MaintenanceLog[]    findAll()
 * @method MaintenanceLog[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MaintenanceLogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MaintenanceLog::class);
    }

    /**
     * Find maintenance logs for a specific plane, ordered by date descending
     *
     * @param Plane $plane
     * @return MaintenanceLog[]
     */
    public function findByPlaneOrderedByDate(Plane $plane): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.plane = :plane')
            ->setParameter('plane', $plane)
            ->orderBy('m.date', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find recent maintenance logs
     *
     * @param int $limit
     * @return MaintenanceLog[]
     */
    public function findRecentLogs(int $limit = 10): array
    {
        return $this->createQueryBuilder('m')
            ->orderBy('m.date', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Find maintenance logs within a date range
     *
     * @param \DateTimeInterface $startDate
     * @param \DateTimeInterface $endDate
     * @return MaintenanceLog[]
     */
    public function findByDateRange(\DateTimeInterface $startDate, \DateTimeInterface $endDate): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.date BETWEEN :startDate AND :endDate')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->orderBy('m.date', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Search maintenance logs by description
     *
     * @param string $searchTerm
     * @return MaintenanceLog[]
     */
    public function searchByDescription(string $searchTerm): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.description LIKE :searchTerm')
            ->setParameter('searchTerm', '%' . $searchTerm . '%')
            ->orderBy('m.date', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Save a new maintenance log
     *
     * @param MaintenanceLog $maintenanceLog
     * @return void
     */
    public function save(MaintenanceLog $maintenanceLog): void
    {
        $this->_em->persist($maintenanceLog);
        $this->_em->flush();
    }

    /**
     * Remove a maintenance log
     *
     * @param MaintenanceLog $maintenanceLog
     * @return void
     */
    public function remove(MaintenanceLog $maintenanceLog): void
    {
        $this->_em->remove($maintenanceLog);
        $this->_em->flush();
    }
}
