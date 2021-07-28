<?php

namespace App\Repository;

use App\Entity\RiderMeetup;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query;
use Doctrine\ORM\Query\ResultSetMappingBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method RiderMeetup|null find($id, $lockMode = null, $lockVersion = null)
 * @method RiderMeetup|null findOneBy(array $criteria, array $orderBy = null)
 * @method RiderMeetup[]    findAll()
 * @method RiderMeetup[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RiderMeetupRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RiderMeetup::class);
    }

    public function getRiderMeetupsAroundLocation(float $lat, float $lng, float $distance)
    {
        $dateNow = (new \DateTime('now', new \DateTimeZone('UTC')));

        return $this->createQueryBuilder('rm')
            ->andWhere(
                '3959 * acos(cos(radians(:lat))' .
                '* cos(radians(rm.lat))' .
                '* cos(radians(rm.lng) - radians(:lng))'.
                '+ sin(radians(:lat))'.
                '* sin(radians(rm.lat))) < :distance')
            ->setParameter('lat', $lat)
            ->setParameter('lng', $lng)
            ->setParameter('distance', $distance)
            ->andWhere('rm.expireDate > :now')
            ->setParameter('now', $dateNow)
            ->orderBy('rm.expireDate', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

//    public function getStuff(float $lat, float $lng, float $distance)
//    {
//        $rsm = new ResultSetMappingBuilder($this->getEntityManager());
//        $rsm->addRootEntityFromClassMetadata('App\Entity\RiderMeetup', 'rm');
//
//        $sql = '
//            SELECT SELECT id, user_uuid, create_date, meetup_date, expire_date, title, description, lat, lng
//            FROM rider_meetup rm
//            WHERE (
//            3959 * acos(
//                cos(radians(?))
//                * cos(radians(lat))
//                * cos(radians(lng) - radians(?))
//                + sin(radians(?))
//                * sin(radians(lat))
//            )
//            ) < ?
//            AND expire_date > ?
//            ORDER BY expire_date DESC
//            ';
//
//        $query = $this->getEntityManager()->createNativeQuery($sql, $rsm);
//        $query->setParameter(1, $lat);
//        $query->setParameter(2, $lng);
//        $query->setParameter(3, $lat);
//        $query->setParameter(4, $distance);
//
//        $dateNow = (new \DateTime('now', new \DateTimeZone('UTC')));
//        $query->setParameter(5, $dateNow);
//
//        return $query->getResult();
//    }

    // /**
    //  * @return RiderMeetup[] Returns an array of RiderMeetup objects
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
    public function findOneBySomeField($value): ?RiderMeetup
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
