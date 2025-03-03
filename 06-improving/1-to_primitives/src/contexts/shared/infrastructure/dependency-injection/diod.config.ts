import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { ContainerBuilder } from "diod";
import { Kafka } from "kafkajs";

import { CourseCreator } from "../../../mooc/courses/application/create/CourseCreator";
import { CourseDeleter } from "../../../mooc/courses/application/delete/CourseDeleter";
import { CourseSnapshotPublisher } from "../../../mooc/courses/application/publish-snapshot/CourseSnapshotPublisher";
import { PublishCourseSnapshotOnCourseDomainEvent } from "../../../mooc/courses/application/publish-snapshot/PublishCourseSnapshotOnCourseDomainEvent";
import { CourseRenamer } from "../../../mooc/courses/application/rename/CourseRenamer";
import { CoursesByIdsSearcher } from "../../../mooc/courses/application/search-by-ids/CoursesByIdsSearcher";
import { CourseRepository } from "../../../mooc/courses/domain/CourseRepository";
import { DomainCourseFinder } from "../../../mooc/courses/domain/DomainCourseFinder";
import { PostgresCourseRepository } from "../../../mooc/courses/infrastructure/PostgresCourseRepository";
import { UserCourseProgressCompleter } from "../../../mooc/user-course-progress/application/complete/UserCourseProgressCompleter";
import { UserFinder } from "../../../mooc/users/application/find/UserFinder";
import { UserRegistrar } from "../../../mooc/users/application/registrar/UserRegistrar";
import { DomainUserFinder } from "../../../mooc/users/domain/DomainUserFinder";
import { UserRepository } from "../../../mooc/users/domain/UserRepository";
import { PostgresUserRepository } from "../../../mooc/users/infrastructure/PostgresUserRepository";
import { ShopCourseSnapshotProjector } from "../../../shop/courses/application/project/ShopCourseSnapshotProjector";
import { ShopCourseRepository } from "../../../shop/courses/domain/ShopCourseRepository";
import { PostgresShopCourseRepository } from "../../../shop/courses/infraestrcuture/PostgresShopCourseRepository";
import { Clock, SystemClock } from "../../domain/Clock";
import { EventBus } from "../../domain/event/EventBus";
import { SnapshotPublisher } from "../../domain/SnapshotPublisher";
import { InMemoryEventBus } from "../domain-event/InMemoryEventBus";
import { KafkaConsumer } from "../kafka/KafkaConsumer";
import { KafkaProducer } from "../kafka/KafkaProducer";
import { KafkaSnapshotPublisher } from "../kafka/KafkaSnapshotPublisher";
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

builder.registerAndUse(KafkaProducer);
builder.registerAndUse(KafkaConsumer);
builder
	.register(SnapshotPublisher)
	.useFactory(
		(container) =>
			new KafkaSnapshotPublisher(
				container.get(KafkaProducer),
				container.get(SchemaRegistry),
				"etc/schemas",
			),
	)
	.asSingleton();

builder
	.register(SchemaRegistry)
	.useFactory(() => new SchemaRegistry({ host: "http://localhost:8081" }))
	.asSingleton();

/* MOOC Context */
// User
builder.register(UserRepository).use(PostgresUserRepository);
builder.registerAndUse(PostgresUserRepository);

builder.registerAndUse(UserRegistrar);

builder.registerAndUse(UserFinder);
builder.registerAndUse(DomainUserFinder);

builder.registerAndUse(UserCourseProgressCompleter);

// Course
builder.register(CourseRepository).use(PostgresCourseRepository);
builder.registerAndUse(PostgresCourseRepository);

builder.registerAndUse(DomainCourseFinder);
builder.registerAndUse(CoursesByIdsSearcher);
builder.registerAndUse(CourseRenamer);
builder.registerAndUse(CourseCreator);
builder.registerAndUse(CourseDeleter);

builder.registerAndUse(CourseSnapshotPublisher);
builder
	.registerAndUse(PublishCourseSnapshotOnCourseDomainEvent)
	.addTag("subscriber");

/* SHOP Context */
// ShopCourse
builder.register(ShopCourseRepository).use(PostgresShopCourseRepository);
builder.registerAndUse(PostgresShopCourseRepository);
builder.registerAndUse(ShopCourseSnapshotProjector).addTag("projector");

// Export container
export const container = builder.build();
