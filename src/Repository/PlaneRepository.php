<?php

namespace App\Repository;

use App\Entity\Plane;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Plane>
 *
 * @method Plane|null find($id, $lockMode = null, $lockVersion = null)
 * @method Plane|null findOneBy(array $criteria, array $orderBy = null)
 * @method Plane[]    findAll()
 * @method Plane[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PlaneRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Plane::class);
    }

    //    /**
    //     * @return Plane[] Returns an array of Plane objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Plane
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
    public function getTotalFilesCount(Plane $plane): int
    {
        $result = $this->createQueryBuilder('p')
            ->select('COUNT(f.id) as fileCount')
            ->leftJoin('p.maintenanceLogs', 'ml')
            ->leftJoin('ml.files', 'f')
            ->where('p.id = :planeId')
            ->setParameter('planeId', $plane->getId())
            ->getQuery()
            ->getSingleScalarResult();

        return (int) $result;
    }
}
