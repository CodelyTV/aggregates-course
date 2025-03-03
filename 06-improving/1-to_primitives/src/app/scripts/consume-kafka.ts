/* eslint-disable no-console */
import "reflect-metadata";

import { Primitives } from "@codelytv/primitives-type";

import { SnapshotProjector } from "../../contexts/shared/application/SnapshotProjector";
import { AggregateRoot } from "../../contexts/shared/domain/AggregateRoot";
import { container } from "../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { KafkaConsumer } from "../../contexts/shared/infrastructure/kafka/KafkaConsumer";

async function consumeSnapshot<T extends AggregateRoot>(
	consumer: KafkaConsumer,
	projector: SnapshotProjector<T>,
): Promise<void> {
	await consumer.consume(
		projector.sourceAggregateName(),
		projector.projectorName(),
		(message: Primitives<T>) => {
			return projector.save(message);
		},
		(id: string) => {
			return projector.delete(id);
		},
	);
}

async function main(consumer: KafkaConsumer): Promise<void> {
	const projectors = container
		.findTaggedServiceIdentifiers<
			SnapshotProjector<AggregateRoot>
		>("projector")
		.map((id) => container.get(id));

	await Promise.all(
		projectors.map(
			async (projector) => await consumeSnapshot(consumer, projector),
		),
	);
}

const consumer = container.get(KafkaConsumer);

main(consumer)
	.catch(console.error)
	.finally(async () => {
		console.log("Done!");

		process.exit(0);
	});
