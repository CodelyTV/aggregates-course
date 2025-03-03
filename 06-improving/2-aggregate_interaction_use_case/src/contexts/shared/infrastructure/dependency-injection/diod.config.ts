import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { ContainerBuilder } from "diod";
import { Kafka } from "kafkajs";

import { CourseCreator } from "../../../mooc/courses/application/create/CourseCreator";
import { CourseDeleter } from "../../../mooc/courses/application/delete/CourseDeleter";
import { CourseRenamer } from "../../../mooc/courses/application/rename/CourseRenamer";
import { CoursesByIdsSearcher } from "../../../mooc/courses/application/search-by-ids/CoursesByIdsSearcher";
import { CourseRepository } from "../../../mooc/courses/domain/CourseRepository";
import { DomainCourseFinder } from "../../../mooc/courses/domain/DomainCourseFinder";
import { PostgresCourseRepository } from "../../../mooc/courses/infrastructure/PostgresCourseRepository";
import { Clock, SystemClock } from "../../domain/Clock";
import { EventBus } from "../../domain/event/EventBus";
import { InMemoryEventBus } from "../domain-event/InMemoryEventBus";
import { PostgresConnection } from "../postgres/PostgresConnection";

const builder = new ContainerBuilder();

/* SHARED Context */
builder
	.register(PostgresConnection)
	.useFactory(() => {
		return new PostgresConnection(
			"localhost",
			5432,
			"codely",
			"c0d3ly7v",
			"postgres",
		);
	})
	.asSingleton();

builder.register(EventBus).use(InMemoryEventBus);
builder.register(Clock).use(SystemClock);

// Kafka
builder
	.register(Kafka)
	.useFactory(() => new Kafka({ brokers: ["localhost:9092"] }))
	.asSingleton();

builder
	.register(SchemaRegistry)
	.useFactory(() => new SchemaRegistry({ host: "http://localhost:8081" }))
	.asSingleton();

/* MOOC Context */
// Course
builder.register(CourseRepository).use(PostgresCourseRepository);
builder.registerAndUse(PostgresCourseRepository);

builder.registerAndUse(DomainCourseFinder);
builder.registerAndUse(CoursesByIdsSearcher);
builder.registerAndUse(CourseRenamer);
builder.registerAndUse(CourseCreator);
builder.registerAndUse(CourseDeleter);

// Export container
export const container = builder.build();
