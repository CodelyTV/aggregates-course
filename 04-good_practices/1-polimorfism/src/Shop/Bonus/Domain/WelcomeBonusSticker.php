<?php

namespace CodelyTv\Shop\Bonus\Domain;

final readonly class WelcomeBonusSticker
{
    public function __construct(public string $stickerId)
    {
    }
}
