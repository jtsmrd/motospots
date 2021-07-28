<?php


namespace App\Entity;


interface CreateDateEntityInterface
{
    public function setCreateDate(\DateTimeInterface $createDate): CreateDateEntityInterface;
}