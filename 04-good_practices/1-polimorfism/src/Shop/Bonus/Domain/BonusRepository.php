<?php

namespace CodelyTv\Shop\Bonus\Domain;

interface BonusRepository
{
    public function save(Bonus $bonus): void;

    public function search(BonusId $id): ?Bonus;

    /** @return Bonus[] */
    public function searchAll(): array;
}
