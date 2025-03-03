import { Primitives } from "@codelytv/primitives-type";

import { AggregateRoot } from "../domain/AggregateRoot";

export interface SnapshotProjector<T extends AggregateRoot> {
	save(aggregate: Primitives<T>): Promise<void>;

	delete(id: string): Promise<void>;

	sourceAggregateName(): string;

	projectorName(): string;
}
