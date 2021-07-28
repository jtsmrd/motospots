<?php


namespace App\Controller;


use App\Entity\RiderCheckin;
use App\Repository\RiderCheckinRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class GetRiderCheckinsAction extends AbstractController
{
    /**
     * @var RiderCheckinRepository
     */
    private $riderCheckinRepository;

    public function __construct(RiderCheckinRepository $riderCheckinRepository)
    {
        $this->riderCheckinRepository = $riderCheckinRepository;
    }

    public function __invoke(Request $request)
    {
        $lat = floatval($request->query->get('lat'));
        $lon = floatval($request->query->get('lng'));
        $distance = floatval($request->query->get('distance'));

        $checkins = $this->riderCheckinRepository->getRiderCheckinsAroundLocation($lat, $lon, $distance);

//        return new JsonResponse($checkins, Response::HTTP_OK);
        return $this->json($checkins, Response::HTTP_OK, [], ['groups' =>['read']]);
    }
}