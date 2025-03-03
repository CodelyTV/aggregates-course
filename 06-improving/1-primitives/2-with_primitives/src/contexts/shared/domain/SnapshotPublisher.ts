import { Primitives } from "@codelytv/primitives-type";

import { AggregateRoot } from "./AggregateRoot";

export abstract class SnapshotPublisher {
	abstract publish(snapshot: Primitives<AggregateRoot>): Promise<void>;

	abstract delete(aggregateId: string, aggregateName: string): Promise<void>;
}
