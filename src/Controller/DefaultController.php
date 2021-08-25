<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Uid\Uuid;

class DefaultController extends AbstractController
{
    /**
     * @Route("/{reactRouting}", name="index", defaults={"reactRouting": null})
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $userUUID = $request->cookies->get('user_uuid');

        $response = new Response();

        if (!$userUUID) {
            $response->headers->setCookie(new Cookie(
                'user_uuid',
                Uuid::v4(),
                strtotime("+1 year"),
                '/',
                null,
                null,
                false
            ));
        }

        return $this->render('default/index.html.twig', [], $response);
    }
}
