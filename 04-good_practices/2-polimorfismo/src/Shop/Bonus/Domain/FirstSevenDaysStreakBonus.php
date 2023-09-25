<?php

namespace CodelyTv\Shop\Bonus\Domain;

final class FirstSevenDaysStreakBonus extends Bonus
{
    public function __construct(BonusId $id)
    {
        parent::__construct($id, BonusReward::TEN_PERCENT_DISCOUNT);
    }
}
