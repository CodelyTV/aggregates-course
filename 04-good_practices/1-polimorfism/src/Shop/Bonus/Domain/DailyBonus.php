<?php

namespace CodelyTv\Shop\Bonus\Domain;

final class DailyBonus extends Bonus
{
    public function __construct(BonusId $id)
    {
        parent::__construct($id, BonusReward::ONE_CODELIRA);
    }
}
