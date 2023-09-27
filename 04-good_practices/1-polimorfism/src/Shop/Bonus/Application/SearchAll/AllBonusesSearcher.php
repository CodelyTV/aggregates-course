<?php

namespace CodelyTv\Shop\Bonus\Application\SearchAll;

use CodelyTv\Shop\Bonus\Domain\BonusRepository;

final readonly class AllBonusesSearcher
{
    public function __construct(private BonusRepository $repository)
    {
    }

    public function search(): array
    {
        return $this->repository->searchAll();
    }
}
