import { Primitives } from "@codelytv/primitives-type";
import { faker } from "@faker-js/faker";

import { Course } from "../../../../../src/contexts/mooc/courses/domain/Course";
import { CourseCreatedDomainEvent } from "../../../../../src/contexts/mooc/courses/domain/CourseCreatedDomainEvent";

import { CourseIdMother } from "./CourseIdMother";

export class CourseCreatedDomainEventMother {
	static create(
		params?: Partial<Primitives<Course>>,
	): CourseCreatedDomainEvent {
		const id = CourseIdMother.create().value;
		const primitives: Primitives<Course> = {
			aggregateId: id,
			aggregateName: "codely.mooc.courses",
			id,
			name: faker.internet.domainWord(),
			summary: faker.lorem.word({ length: 10 }),
			categories: [faker.lorem.word()],
			publishedAt: faker.date.recent().getTime(),
			...params,
		};

		return new CourseCreatedDomainEvent(
			primitives.id,
			primitives.name,
			primitives.summary,
			primitives.categories,
			new Date(primitives.publishedAt),
		);
	}
}
