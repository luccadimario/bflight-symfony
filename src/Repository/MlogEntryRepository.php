<?php

namespace App\Repository;

use App\Entity\MlogEntry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MlogEntry>
 *
 * @method MlogEntry|null find($id, $lockMode = null, $lockVersion = null)
 * @method MlogEntry|null findOneBy(array $criteria, array $orderBy = null)
 * @method MlogEntry[]    findAll()
 * @method MlogEntry[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MlogEntryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MlogEntry::class);
    }

    //    /**
    //     * @return MlogEntry[] Returns an array of MlogEntry objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?MlogEntry
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
