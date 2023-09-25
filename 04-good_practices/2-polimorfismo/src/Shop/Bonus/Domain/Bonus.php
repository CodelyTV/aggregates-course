<?php

namespace CodelyTv\Shop\Bonus\Domain;

abstract class Bonus
{
    public function __construct(public readonly BonusId $id, public readonly BonusReward $name)
    {
    }
}
