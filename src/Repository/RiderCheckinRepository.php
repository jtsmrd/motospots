<?php

namespace App\Repository;

use App\Entity\RiderCheckin;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\ResultSetMappingBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method RiderCheckin|null find($id, $lockMode = null, $lockVersion = null)
 * @method RiderCheckin|null findOneBy(array $criteria, array $orderBy = null)
 * @method RiderCheckin[]    findAll()
 * @method RiderCheckin[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RiderCheckinRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RiderCheckin::class);
    }

    public function getRiderCheckinsAroundLocation(float $lat, float $lng, float $distance)
    {
        $dateNow = new \DateTime(
            'now',
            new \DateTimeZone('UTC')
        );

        return $this->createQueryBuilder('rc')
            ->andWhere(
                '3959 * acos(cos(radians(:lat))' .
                '* cos(radians(rc.lat))' .
                '* cos(radians(rc.lng) - radians(:lng))'.
                '+ sin(radians(:lat))'.
                '* sin(radians(rc.lat))) < :distance')
            ->setParameter('lat', $lat)
            ->setParameter('lng', $lng)
            ->setParameter('distance', $distance)
            ->andWhere('rc.expireDate > :now')
            ->setParameter('now', $dateNow)
            ->orderBy('rc.expireDate', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * @param string $uuid
     * @return int|mixed|string|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getActiveRiderCheckin(string $userUUID)
    {
        $dateNow = new \DateTime(
            'now',
            new \DateTimeZone('UTC')
        );

        return $this->createQueryBuilder('rc')
            ->andWhere('rc.userUUID = :userUUID')
            ->setParameter('userUUID', $userUUID)
            ->andWhere('rc.expireDate > :now')
            ->setParameter('now', $dateNow)
            ->orderBy('rc.id', 'DESC')
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    // /**
    //  * @return RiderCheckin[] Returns an array of RiderCheckin objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('r.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?RiderCheckin
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
