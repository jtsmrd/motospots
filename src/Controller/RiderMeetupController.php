<?php


namespace App\Controller;

use App\Entity\RiderMeetup;
use App\Exception\InvalidDataException;
use DateTime;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints as Assert;


class RiderMeetupController extends AbstractController
{
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        EntityManagerInterface $entityManager,
        LoggerInterface $logger
    )
    {
        $this->entityManager = $entityManager;
        $this->logger = $logger;
    }

    /**
     * @Route("/api/rider_meetup", name="create_rider_meetup", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function createRiderMeetup(Request $request): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);
        if (!is_array($requestData)) {
            return new JsonResponse([], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->createRiderMeetupIsValid($requestData);
        } catch (InvalidDataException $e) {
            return new JsonResponse([
                'message' => $e->getMessage(),
                'errors' => $e->getErrors()
            ], Response::HTTP_BAD_REQUEST);
        }

        $userUUID = $request->cookies->get('user_uuid');

        $accessor = PropertyAccess::createPropertyAccessor();

        $title = $accessor->getValue(
            $requestData,
            '[title]'
        );
        if (!isset($title) || trim($title) === '') {
            $title = 'New Meetup';
        }
        $description = $accessor->getValue(
            $requestData,
            '[description]'
        );
        if (!isset($description) || trim($description) === '') {
            $description = '(no description)';
        }
        $lat = $accessor->getValue(
            $requestData,
            '[lat]'
        );
        $lng = $accessor->getValue(
            $requestData,
            '[lng]'
        );
        $meetupDateString = $accessor->getValue(
            $requestData,
            '[meetup_date]'
        );
        $meetupDate = new DateTime(
            $meetupDateString,
            new DateTimeZone('UTC')
        );
        $rideStartDateString = $accessor->getValue(
            $requestData,
            '[ride_start_date]'
        );
        $rideStartDate = new DateTime(
            $rideStartDateString,
            new DateTimeZone('UTC')
        );
        // Default expire date to end of meetup day
        $expireDate = clone $meetupDate;
        $expireDate->modify('tomorrow');
        $expireDate->setTimestamp($expireDate->getTimestamp() - 1);

        $riderMeetup = new RiderMeetup();
        $riderMeetup
            ->setUserUUID($userUUID)
            ->setTitle($title)
            ->setDescription($description)
            ->setLat($lat)
            ->setLng($lng)
            ->setMeetupDate($meetupDate)
            ->setRideStartDate($rideStartDate)
            ->setExpireDate($expireDate)
        ;

        $this->entityManager->persist($riderMeetup);
        $this->entityManager->flush();

        $this->logger->info('RiderMeetup created', [
            'route_name' => 'create_rider_meetup',
            'user_uuid' => $userUUID,
            'success' => true
        ]);

        return new JsonResponse([
            'id' => $riderMeetup->getId(),
            'userUUID' => $riderMeetup->getUserUUID(),
            'createDate' => $riderMeetup->getCreateDate()->format('Y-m-d H:i:s'),
            'expireDate' => $riderMeetup->getExpireDate()->format('Y-m-d H:i:s'),
            'meetupDate' => $riderMeetup->getMeetupDate()->format('Y-m-d H:i:s'),
            'rideStartDate' => $riderMeetup->getRideStartDate()->format('Y-m-d H:i:s'),
            'title' => $riderMeetup->getTitle(),
            'description' => $riderMeetup->getDescription(),
            'lat' => $riderMeetup->getLat(),
            'lng' => $riderMeetup->getLng()
        ], Response::HTTP_CREATED);
    }

    /**
     * @Route("/api/rider_meetups", name="get_rider_meetups", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function getRiderMeetups(Request $request): JsonResponse
    {
        $lat = floatval($request->query->get('lat'));
        $lng = floatval($request->query->get('lng'));
        $distance = floatval($request->query->get('distance'));

        $repository = $this->getDoctrine()->getRepository(
            RiderMeetup::class
        );
        $meetups = $repository->getRiderMeetupsAroundLocation(
            $lat,
            $lng,
            $distance
        );

        $meetupsCollection = [];

        /** @var RiderMeetup $meetup */
        foreach ($meetups as $meetup) {
            $meetupsCollection[] = [
                'id' => $meetup->getId(),
                'userUUID' => $meetup->getUserUUID(),
                'createDate' => $meetup->getCreateDate()->format('Y-m-d H:i:s'),
                'expireDate' => $meetup->getExpireDate()->format('Y-m-d H:i:s'),
                'meetupDate' => $meetup->getMeetupDate()->format('Y-m-d H:i:s'),
                'rideStartDate' => $meetup->getRideStartDate()->format('Y-m-d H:i:s'),
                'title' => $meetup->getTitle(),
                'description' => $meetup->getDescription(),
                'lat' => $meetup->getLat(),
                'lng' => $meetup->getLng()
            ];
        }

        $this->logger->info('RiderMeetups fetched', [
            'route_name' => 'get_rider_meetups',
            'count' => count($meetupsCollection),
            'success' => true
        ]);

        return new JsonResponse($meetupsCollection, Response::HTTP_OK);
    }

    /**
     * @Route("/api/rider_meetup/{id}", name="update_rider_meetup", methods={"PUT"})
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     * @throws \Exception
     */
    public function updateRiderMeetup(Request $request, int $id): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);
        if (!is_array($requestData)) {
            return new JsonResponse([], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->updateRiderMeetupIsValid($requestData);
        } catch (InvalidDataException $e) {
            return new JsonResponse([
                'message' => $e->getMessage(),
                'errors' => $e->getErrors()
            ], Response::HTTP_BAD_REQUEST);
        }

        // Make sure we can identify the user updating the rider meetup
        $userUUID = $request->cookies->get('user_uuid');
        if (!$userUUID) {
            return new JsonResponse(null, Response::HTTP_FORBIDDEN);
        }

        $repository = $this->getDoctrine()->getRepository(
            RiderMeetup::class
        );
        $riderMeetup = $repository->findOneBy([
            'userUUID' => $userUUID,
            'id' => $id
        ]);

        if (!$riderMeetup) {
            return new JsonResponse(null, Response::HTTP_NOT_FOUND);
        }

        $accessor = PropertyAccess::createPropertyAccessor();

        $title = $accessor->getValue(
            $requestData,
            '[title]'
        );
        if (!isset($title) || trim($title) === '') {
            $title = 'New Meetup';
        }
        $description = $accessor->getValue(
            $requestData,
            '[description]'
        );
        if (!isset($description) || trim($description) === '') {
            $description = '(no description)';
        }
        $meetupDateString = $accessor->getValue(
            $requestData,
            '[meetup_date]'
        );
        $meetupDate = new DateTime(
            $meetupDateString,
            new DateTimeZone('UTC')
        );
        $rideStartDateString = $accessor->getValue(
            $requestData,
            '[ride_start_date]'
        );
        $rideStartDate = new DateTime(
            $rideStartDateString,
            new DateTimeZone('UTC')
        );
        // Default expire date to end of meetup day
        $expireDate = clone $meetupDate;
        $expireDate->modify('tomorrow');
        $expireDate->setTimestamp($expireDate->getTimestamp() - 1);

        $riderMeetup
            ->setTitle($title)
            ->setDescription($description)
            ->setMeetupDate($meetupDate)
            ->setRideStartDate($rideStartDate)
            ->setExpireDate($expireDate)
        ;

        $this->entityManager->persist($riderMeetup);
        $this->entityManager->flush();

        $this->logger->info('RiderMeetup updated', [
            'route_name' => 'update_rider_meetup',
            'user_uuid' => $userUUID,
            'success' => true
        ]);

        return new JsonResponse([
            'id' => $riderMeetup->getId(),
            'userUUID' => $riderMeetup->getUserUUID(),
            'createDate' => $riderMeetup->getCreateDate()->format('Y-m-d H:i:s'),
            'expireDate' => $riderMeetup->getExpireDate()->format('Y-m-d H:i:s'),
            'meetupDate' => $riderMeetup->getMeetupDate()->format('Y-m-d H:i:s'),
            'rideStartDate' => $riderMeetup->getRideStartDate()->format('Y-m-d H:i:s'),
            'title' => $riderMeetup->getTitle(),
            'description' => $riderMeetup->getDescription(),
            'lat' => $riderMeetup->getLat(),
            'lng' => $riderMeetup->getLng()
        ], Response::HTTP_OK);
    }

    /**
     * @Route("/api/rider_meetup/{id}", name="expire_rider_meetup", methods={"DELETE"})
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     * @throws \Exception
     */
    public function expireRiderMeetup(Request $request, int $id): JsonResponse
    {
        $userUUID = $request->cookies->get('user_uuid');
        if (!$userUUID) {
            return new JsonResponse(null, Response::HTTP_FORBIDDEN);
        }

        $repository = $this->getDoctrine()->getRepository(
            RiderMeetup::class
        );

        /** @var RiderMeetup $riderMeetup */
        $riderMeetup = $repository->findOneBy([
            'userUUID' => $userUUID,
            'id' => $id
        ]);
        if (!$riderMeetup) {
            return new JsonResponse(null, Response::HTTP_NOT_FOUND);
        }

        $expireDate = new DateTime(
            'now',
            new DateTimeZone('UTC')
        );
        $riderMeetup->setExpireDate($expireDate);

        $this->entityManager->persist($riderMeetup);
        $this->entityManager->flush();

        $this->logger->info('RiderMeetup deleted', [
            'route_name' => 'expire_rider_meetup',
            'user_uuid' => $userUUID,
            'success' => true
        ]);

        return new JsonResponse([
            'id' => $riderMeetup->getId(),
            'userUUID' => $riderMeetup->getUserUUID(),
            'createDate' => $riderMeetup->getCreateDate()->format('Y-m-d H:i:s'),
            'expireDate' => $riderMeetup->getExpireDate()->format('Y-m-d H:i:s'),
            'meetupDate' => $riderMeetup->getMeetupDate()->format('Y-m-d H:i:s'),
            'rideStartDate' => $riderMeetup->getRideStartDate()->format('Y-m-d H:i:s'),
            'title' => $riderMeetup->getTitle(),
            'description' => $riderMeetup->getDescription(),
            'lat' => $riderMeetup->getLat(),
            'lng' => $riderMeetup->getLng()
        ], Response::HTTP_OK);
    }

    private function createRiderMeetupIsValid(array $requestData): void
    {
        $constraints = new Assert\Collection([
            'title' => new Assert\Optional(),
            'description' => new Assert\Optional(),
            'meetup_date' => new Assert\Required([
                new Assert\NotBlank()
            ]),
            'ride_start_date' => new Assert\Required([
                new Assert\NotBlank()
            ]),
            'lat' => new Assert\Required([
                new Assert\NotBlank()
            ]),
            'lng' => new Assert\Required([
                new Assert\NotBlank()
            ]),
        ]);

        $validator = Validation::createValidator();
        $errors = $validator->validate($requestData, $constraints);

        if (count($errors) > 0) {
            $messages = [];

            /** @var ConstraintViolation $violation */
            foreach ($errors as $violation) {
                $messages[$violation->getPropertyPath()][] = $violation->getMessage();
            }
            throw new InvalidDataException('Validation Errors', $messages);
        }
    }

    private function updateRiderMeetupIsValid(array $requestData): void
    {
        $constraints = new Assert\Collection([
            'title' => new Assert\Optional(),
            'description' => new Assert\Optional(),
            'meetup_date' => new Assert\Required([
                new Assert\NotBlank()
            ]),
            'ride_start_date' => new Assert\Required([
                new Assert\NotBlank()
            ]),
        ]);

        $validator = Validation::createValidator();
        $errors = $validator->validate($requestData, $constraints);

        if (count($errors) > 0) {
            $messages = [];

            /** @var ConstraintViolation $violation */
            foreach ($errors as $violation) {
                $messages[$violation->getPropertyPath()][] = $violation->getMessage();
            }
            throw new InvalidDataException('Validation Errors', $messages);
        }
    }
}