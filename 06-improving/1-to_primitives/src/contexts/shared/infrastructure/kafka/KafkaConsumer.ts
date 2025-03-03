/* eslint-disable no-console */
import { Primitives } from "@codelytv/primitives-type";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { Service } from "diod";
import { Admin, Kafka } from "kafkajs";

import { AggregateRoot } from "../../domain/AggregateRoot";

@Service()
export class KafkaConsumer {
	private readonly admin: Admin;

	constructor(
		private readonly kafka: Kafka,
		private readonly registry: SchemaRegistry,
	) {
		this.admin = this.kafka.admin();
	}

	async consume<T extends AggregateRoot>(
		topic: string,
		groupId: string,
		onMessage: (aggregate: Primitives<T>) => Promise<void>,
		onDelete: (id: string) => Promise<void>,
	): Promise<void> {
		const groups = await this.admin.listGroups();
		const groupExists = groups.groups.some(
			(group) => group.groupId === groupId,
		);

		const consumer = this.kafka.consumer({ groupId });
		await consumer.connect();
		await consumer.subscribe({
			topics: [topic],
			fromBeginning: !groupExists,
		});

		await consumer.run({
			eachMessage: async ({ message }) => {
				if (message.value === null) {
					return await onDelete(message.key?.toString() ?? "");
				}

				const messageValue = await this.registry.decode(message.value);
				console.log(messageValue);
				await onMessage(JSON.parse(messageValue));
			},
		});

		return new Promise(() => {
			process.on("SIGTERM", async () => {
				await consumer.disconnect();

				process.exit(0);
			});
		});
	}
}
