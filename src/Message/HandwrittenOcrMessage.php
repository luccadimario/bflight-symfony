<?php

namespace App\Message;

final class HandwrittenOcrMessage
{
    private $requestData;
    public function __construct($requestData)
    {
        $this->requestData = $requestData;
    }

    public function getRequestData()
    {
        return $this->requestData;
    }
}
