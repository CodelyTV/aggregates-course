<?php

namespace CodelyTv\Shop\Bonus\Domain;

final class WelcomeBonus extends Bonus
{
    public function __construct(BonusId $id, public WelcomeBonusSticker $sticker)
    {
        parent::__construct($id, BonusReward::TEN_PERCENT_DISCOUNT);
    }
}
