import { Primitives } from "@codelytv/primitives-type";
import { faker } from "@faker-js/faker";

import { Course } from "../../../../../src/contexts/mooc/courses/domain/Course";
import { CourseCreatedDomainEvent } from "../../../../../src/contexts/mooc/courses/domain/CourseCreatedDomainEvent";

import { CourseIdMother } from "./CourseIdMother";

export class CourseCreatedDomainEventMother {
	static create(
		params?: Partial<Primitives<CourseCreatedDomainEvent>>,
	): CourseCreatedDomainEvent {
		const primitives: Primitives<Course> = {
			id: CourseIdMother.create().value,
			name: faker.internet.domainWord(),
			summary: faker.lorem.word({ length: 10 }),
			categories: [faker.lorem.word()],
			...params,
		};

		return new CourseCreatedDomainEvent(
			primitives.id,
			primitives.name,
			primitives.summary,
			primitives.categories,
		);
	}
}
