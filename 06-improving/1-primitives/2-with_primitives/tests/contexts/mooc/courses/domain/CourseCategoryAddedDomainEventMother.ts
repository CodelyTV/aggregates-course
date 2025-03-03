import { faker } from "@faker-js/faker";

import {
	CourseCategoryAddedDomainEvent,
	CourseCategoryAddedDomainEventPrimitives,
} from "../../../../../src/contexts/mooc/courses/domain/CourseCategoryAddedDomainEvent";

import { CourseIdMother } from "./CourseIdMother";

export class CourseCategoryAddedDomainEventMother {
	static create(
		params?: Partial<CourseCategoryAddedDomainEventPrimitives>,
	): CourseCategoryAddedDomainEvent {
		const primitives: CourseCategoryAddedDomainEventPrimitives = {
			id: CourseIdMother.create().value,
			category: faker.internet.domainWord(),
			...params,
		};

		return new CourseCategoryAddedDomainEvent(
			primitives.id,
			primitives.category,
		);
	}
}
