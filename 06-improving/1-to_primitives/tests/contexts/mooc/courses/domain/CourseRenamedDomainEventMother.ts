import { faker } from "@faker-js/faker";

import {
	CourseRenamedDomainEvent,
	CourseRenamedDomainEventPrimitives,
} from "../../../../../src/contexts/mooc/courses/domain/CourseRenamedDomainEvent";

import { CourseIdMother } from "./CourseIdMother";

export class CourseRenamedDomainEventMother {
	static create(
		params?: Partial<CourseRenamedDomainEventPrimitives>,
	): CourseRenamedDomainEvent {
		const primitives: CourseRenamedDomainEventPrimitives = {
			id: CourseIdMother.create().value,
			name: faker.internet.domainWord(),
			...params,
		};

		return new CourseRenamedDomainEvent(primitives.id, primitives.name);
	}
}
