import { Primitives } from "@codelytv/primitives-type";

import { AggregateRoot } from "../../../../src/contexts/shared/domain/AggregateRoot";
import { SnapshotPublisher } from "../../../../src/contexts/shared/domain/SnapshotPublisher";

export class MockSnapshotPublisher implements SnapshotPublisher {
	private readonly mockPublish = jest.fn();
	private readonly mockDelete = jest.fn();

	async publish(snapshot: Primitives<AggregateRoot>): Promise<void> {
		expect(this.mockPublish).toHaveBeenCalledWith(snapshot);

		return Promise.resolve();
	}

	async delete(aggregateId: string, aggregateName: string): Promise<void> {
		expect(this.mockDelete).toHaveBeenCalledWith(
			aggregateId,
			aggregateName,
		);

		return Promise.resolve();
	}

	shouldPublish(snapshot: Primitives<AggregateRoot>): void {
		this.mockPublish(snapshot);
	}

	shouldDelete(aggregateId: string, aggregateName: string): void {
		this.mockDelete(aggregateId, aggregateName);
	}
}
