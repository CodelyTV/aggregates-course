import { Primitives } from "@codelytv/primitives-type";
import {
	readAVSCAsync,
	SchemaRegistry,
} from "@kafkajs/confluent-schema-registry";
import { Service } from "diod";

import { Course } from "../../../mooc/courses/domain/Course";
import { User } from "../../../mooc/users/domain/User";
import { AggregateRoot } from "../../domain/AggregateRoot";
import { SnapshotPublisher } from "../../domain/SnapshotPublisher";

import { KafkaProducer } from "./KafkaProducer";

@Service()
export class KafkaSnapshotPublisher extends SnapshotPublisher {
	private readonly schemes: Record<string, string> = {
		[Course.aggregateName]: "com.codely.mooc.Course",
		[User.aggregateName]: "com.codely.mooc.User",
	};

	private readonly schemaIds: Map<string, number> = new Map();

	constructor(
		private readonly producer: KafkaProducer,
		private readonly registry: SchemaRegistry,
		private readonly schemasPath: string,
	) {
		super();
	}

	async publish(snapshot: Primitives<AggregateRoot>): Promise<void> {
		const schemaId = await this.getOrRegisterSchemaId(
			snapshot.aggregateName,
		);
		const encodedMessage = await this.registry.encode(schemaId, snapshot);

		await this.producer.send(
			snapshot.aggregateName,
			encodedMessage,
			snapshot.aggregateId,
		);
	}

	async delete(aggregateId: string, aggregateName: string): Promise<void> {
		await this.producer.send(aggregateName, null, aggregateId);
	}

	private async getOrRegisterSchemaId(
		aggregateName: string,
	): Promise<number> {
		const cachedId = this.schemaIds.get(aggregateName);

		if (cachedId) {
			return cachedId;
		}

		const schema = await readAVSCAsync(
			`${this.schemasPath}/${this.schemes[aggregateName]}.avsc`,
		);
		const { id } = await this.registry.register(schema);

		this.schemaIds.set(aggregateName, id);

		return id;
	}
}
