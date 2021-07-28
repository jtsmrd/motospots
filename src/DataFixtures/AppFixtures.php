<?php

namespace App\DataFixtures;

use App\Entity\RiderCheckin;
use App\Entity\RiderMeetup;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    /**
     * @var \Faker\Factory
     */
    private $faker;

    public function __construct()
    {
        $this->faker = \Faker\Factory::create();
    }

    public function load(ObjectManager $manager)
    {
        $this->loadRiderCheckins($manager, 100);
        $this->loadRiderMeetups($manager, 10);
    }

    public function loadRiderCheckins(
        ObjectManager $manager,
        int $numRiderCheckins
    )
    {
        for ($i = 0; $i < $numRiderCheckins; $i++) {

            $uuid = $this->faker->uuid;
            $expireDate = new \DateTime(
                'now',
                new \DateTimeZone('UTC')
            );
            $expireDate = $expireDate->add(
                new \DateInterval('PT5H')
            );
            $motorcycleMakeModel = '2011 GSXR 1000';
            $lat = $this->faker->randomFloat(
                12,
                40.38362639665043,
                40.497339166747636
            );
            $lng = $this->faker->randomFloat(
                12,
                -80.20980444333259,
                -79.77145102402869
            );

            $riderCheckin = new RiderCheckin();
            $riderCheckin
                ->setUserUUID($uuid)
                ->setExpireDate($expireDate)
                ->setMotorcycleMakeModel($motorcycleMakeModel)
                ->setLat($lat)
                ->setLng($lng)
            ;
            $manager->persist($riderCheckin);
        }
        $manager->flush();
    }

    public function loadRiderMeetups(
        ObjectManager $manager,
        int $numRiderMeetups
    )
    {
        for ($i = 0; $i < $numRiderMeetups; $i++) {

            $uuid = $this->faker->uuid;
            $title = $this->faker->sentence;
            $description = $this->faker->sentence;
            $meetupDate = new \DateTime(
                'now',
                new \DateTimeZone('UTC')
            );
            $rideStartDate = new \DateTime(
                'now',
                new \DateTimeZone('UTC')
            );
            $rideStartDate = $rideStartDate->add(
                new \DateInterval('PT30M')
            );
            $expireDate = clone $meetupDate;
            $expireDate->modify('tomorrow');
            $expireDate->setTimestamp(
                $expireDate->getTimestamp() - 1
            );
            $lat = $this->faker->randomFloat(
                12,
                40.38362639665043,
                40.497339166747636
            );
            $lng = $this->faker->randomFloat(
                12,
                -80.20980444333259,
                -79.77145102402869
            );

            $riderMeetup = new RiderMeetup();
            $riderMeetup
                ->setUserUUID($uuid)
                ->setTitle($title)
                ->setDescription($description)
                ->setMeetupDate($meetupDate)
                ->setRideStartDate($rideStartDate)
                ->setExpireDate($expireDate)
                ->setLat($lat)
                ->setLng($lng)
            ;
            $manager->persist($riderMeetup);
        }
        $manager->flush();
    }
}
