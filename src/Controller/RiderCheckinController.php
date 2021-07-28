<?php


namespace App\Controller;


use App\Entity\RiderCheckin;
use App\Exception\InvalidDataException;
use DateInterval;
use DateTime;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints as Assert;

class RiderCheckinController extends AbstractController
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
     * @Route("/api/rider_checkin", name="create_rider_checkin", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function createRiderCheckin(Request $request): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);
        if (!is_array($requestData)) {
            return new JsonResponse([], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->createRiderCheckinIsValid($requestData);
        } catch (InvalidDataException $e) {
            return new JsonResponse([
                'message' => $e->getMessage(),
                'errors' => $e->getErrors()
            ], Response::HTTP_BAD_REQUEST);
        }

        $userUUID = $request->cookies->get('user_uuid');
        $newUserUUID = null;

        if (!$userUUID) {
            $newUserUUID = Uuid::v4();
        } else {
            // If existing rider checkin exists, mark as expired
            $repository = $this->getDoctrine()->getRepository(
                RiderCheckin::class
            );

            $existingCheckin = $repository->getActiveRiderCheckin($userUUID);

            if ($existingCheckin) {
                $expireDate = new DateTime(
                    'now',
                    new DateTimeZone('UTC')
                );
                $existingCheckin->setExpireDate($expireDate);
                $this->entityManager->persist($existingCheckin);
            }
        }

        $accessor = PropertyAccess::createPropertyAccessor();

        $expireDateString = $accessor->getValue(
            $requestData,
            '[expire_date]'
        );
        $motorcycleMakeModel = $accessor->getValue(
            $requestData,
            '[motorcycle_make_model]'
        );
        if (!isset($motorcycleMakeModel) || trim($motorcycleMakeModel) === '') {
            $motorcycleMakeModel = null;
        }
        $lat = $accessor->getValue(
            $requestData,
            '[lat]'
        );
        $lng = $accessor->getValue(
            $requestData,
            '[lng]'
        );
        if (!$expireDateString) {
            // Default expire date to + 1 hour if one isn't provided
            $expireDate = new DateTime(
                'now',
                new DateTimeZone('UTC')
            );
            $expireDate = $expireDate->add(
                new DateInterval('PT1H')
            );
        } else {
            $expireDate = new DateTime(
                $expireDateString,
                new DateTimeZone('UTC')
            );
        }

        $riderCheckin = new RiderCheckin();
        $riderCheckin
            ->setUserUUID($userUUID ?? $newUserUUID)
            ->setExpireDate($expireDate)
            ->setMotorcycleMakeModel($motorcycleMakeModel)
            ->setLat($lat)
            ->setLng($lng)
        ;

        $this->entityManager->persist($riderCheckin);
        $this->entityManager->flush();

        $response = new JsonResponse([
            'id' => $riderCheckin->getId(),
            'userUUID' => $riderCheckin->getUserUUID(),
            'createDate' => $riderCheckin->getCreateDate()->format('Y-m-d H:i:s'),
            'expireDate' => $riderCheckin->getExpireDate()->format('Y-m-d H:i:s'),
            'motorcycleMakeModel' => $riderCheckin->getMotorcycleMakeModel(),
            'lat' => $riderCheckin->getLat(),
            'lng' => $riderCheckin->getLng()
        ], Response::HTTP_CREATED);

        if (!$userUUID) {
            $response->headers->setCookie(new Cookie(
                'user_uuid',
                $newUserUUID,
                0,
                '/',
                null,
                null,
                false
            ));
        }

        return $response;
    }

    /**
     * @Route("/api/rider_checkins", name="get_rider_checkins", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function getRiderCheckins(Request $request): JsonResponse
    {
        $lat = floatval($request->query->get('lat'));
        $lng = floatval($request->query->get('lng'));
        $distance = floatval($request->query->get('distance'));

        $repository = $this->getDoctrine()->getRepository(
            RiderCheckin::class
        );
        $riderCheckins = $repository->getRiderCheckinsAroundLocation(
            $lat,
            $lng,
            $distance
        );

        $checkinsCollection = [];

        /** @var RiderCheckin $checkin */
        foreach ($riderCheckins as $riderCheckin) {
            $checkinsCollection[] = [
                'id' => $riderCheckin->getId(),
                'userUUID' => $riderCheckin->getUserUUID(),
                'createDate' => $riderCheckin->getCreateDate()->format('Y-m-d H:i:s'),
                'expireDate' => $riderCheckin->getExpireDate()->format('Y-m-d H:i:s'),
                'motorcycleMakeModel' => $riderCheckin->getMotorcycleMakeModel(),
                'lat' => $riderCheckin->getLat(),
                'lng' => $riderCheckin->getLng()
            ];
        }

        return new JsonResponse($checkinsCollection, Response::HTTP_OK);
    }

    /**
     * @Route("/api/rider_checkin/{id}", name="update_rider_checkin", methods={"PUT"})
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     * @throws \Exception
     */
    public function updateRiderCheckin(Request $request, int $id): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);
        if (!is_array($requestData)) {
            return new JsonResponse([], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->updateRiderCheckinIsValid($requestData);
        } catch (InvalidDataException $e) {
            return new JsonResponse([
                'message' => $e->getMessage(),
                'errors' => $e->getErrors()
            ], Response::HTTP_BAD_REQUEST);
        }

        // Make sure we can identify the user updating the rider checkin
        $userUUID = $request->cookies->get('user_uuid');
        if (!$userUUID) {
            return new JsonResponse(null, Response::HTTP_FORBIDDEN);
        }

        $repository = $this->getDoctrine()->getRepository(
            RiderCheckin::class
        );

        $riderCheckin = $repository->findOneBy([
            'userUUID' => $userUUID,
            'id' => $id
        ]);
        if (!$riderCheckin) {
            return new JsonResponse(null, Response::HTTP_NOT_FOUND);
        }

        $accessor = PropertyAccess::createPropertyAccessor();

        $expireDateString = $accessor->getValue(
            $requestData,
            '[expire_date]'
        );
        $motorcycleMakeModel = $accessor->getValue(
            $requestData,
            '[motorcycle_make_model]'
        );
        if (!isset($motorcycleMakeModel) || trim($motorcycleMakeModel) === '') {
            $motorcycleMakeModel = null;
        }

        if ($expireDateString) {
            $expireDate = new DateTime(
                $expireDateString,
                new DateTimeZone('UTC')
            );
            $riderCheckin->setExpireDate($expireDate);
        }

        if ($motorcycleMakeModel) {
            $riderCheckin->setMotorcycleMakeModel($motorcycleMakeModel);
        }

        $this->entityManager->persist($riderCheckin);
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $riderCheckin->getId(),
            'userUUID' => $riderCheckin->getUserUUID(),
            'createDate' => $riderCheckin->getCreateDate()->format('Y-m-d H:i:s'),
            'expireDate' => $riderCheckin->getExpireDate()->format('Y-m-d H:i:s'),
            'motorcycleMakeModel' => $riderCheckin->getMotorcycleMakeModel(),
            'lat' => $riderCheckin->getLat(),
            'lng' => $riderCheckin->getLng()
        ], Response::HTTP_OK);
    }

    /**
     * @Route("/api/rider_checkin/{id}", name="expire_rider_checkin", methods={"DELETE"})
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     * @throws \Exception
     */
    public function expireRiderCheckin(Request $request, int $id): JsonResponse
    {
        $userUUID = $request->cookies->get('user_uuid');
        if (!$userUUID) {
            return new JsonResponse(null, Response::HTTP_FORBIDDEN);
        }

        $repository = $this->getDoctrine()->getRepository(
            RiderCheckin::class
        );

        $riderCheckin = $repository->findOneBy([
            'userUUID' => $userUUID,
            'id' => $id
        ]);
        if (!$riderCheckin) {
            return new JsonResponse(null, Response::HTTP_NOT_FOUND);
        }

        $expireDate = new DateTime(
            'now',
            new DateTimeZone('UTC')
        );
        $riderCheckin->setExpireDate($expireDate);

        $this->entityManager->persist($riderCheckin);
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $riderCheckin->getId(),
            'userUUID' => $riderCheckin->getUserUUID(),
            'createDate' => $riderCheckin->getCreateDate()->format('Y-m-d H:i:s'),
            'expireDate' => $riderCheckin->getExpireDate()->format('Y-m-d H:i:s'),
            'motorcycleMakeModel' => $riderCheckin->getMotorcycleMakeModel(),
            'lat' => $riderCheckin->getLat(),
            'lng' => $riderCheckin->getLng()
        ], Response::HTTP_OK);
    }

    private function createRiderCheckinIsValid(array $requestData): void
    {
        $constraints = new Assert\Collection([
            'motorcycle_make_model' => new Assert\Optional(),
            'expire_date' => new Assert\Optional(),
            'lat' => new Assert\Required([
                new Assert\NotBlank()
            ]),
            'lng' => new Assert\Required([
                new Assert\NotBlank()
            ])
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

    private function updateRiderCheckinIsValid(array $requestData): void
    {
        $constraints = new Assert\Collection([
            'motorcycle_make_model' => new Assert\Optional(),
            'expire_date' => new Assert\Optional(),
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