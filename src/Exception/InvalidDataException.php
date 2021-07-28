<?php

declare(strict_types=1);

namespace App\Exception;

use Throwable;

class InvalidDataException extends \Exception
{
    private $errors;

    public function __construct(string $message, array $errors = [], $code = 0, Throwable $previous = null)
    {
        $this->errors = $errors;
        parent::__construct($message, $code, $previous);
    }

    /**
     * @return array
     */
    public function getErrors(): array
    {
        return $this->errors;
    }
}