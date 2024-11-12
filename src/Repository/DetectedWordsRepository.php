<?php

namespace App\Repository;

use App\Entity\DetectedWords;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DetectedWords>
 *
 * @method DetectedWords|null find($id, $lockMode = null, $lockVersion = null)
 * @method DetectedWords|null findOneBy(array $criteria, array $orderBy = null)
 * @method DetectedWords[]    findAll()
 * @method DetectedWords[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DetectedWordsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DetectedWords::class);
    }

    //    /**
    //     * @return DetectedWords[] Returns an array of DetectedWords objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('d.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?DetectedWords
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
