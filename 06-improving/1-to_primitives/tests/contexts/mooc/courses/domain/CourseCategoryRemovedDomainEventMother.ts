import { faker } from "@faker-js/faker";

import {
	CourseCategoryRemovedDomainEvent,
	CourseCategoryRemovedDomainEventPrimitives,
} from "../../../../../src/contexts/mooc/courses/domain/CourseCategoryRemovedDomainEvent";

import { CourseIdMother } from "./CourseIdMother";

export class CourseCategoryRemovedDomainEventMother {
	static create(
		params?: Partial<CourseCategoryRemovedDomainEventPrimitives>,
	): CourseCategoryRemovedDomainEvent {
		const primitives: CourseCategoryRemovedDomainEventPrimitives = {
			id: CourseIdMother.create().value,
			category: faker.internet.domainWord(),
			...params,
		};

		return new CourseCategoryRemovedDomainEvent(
			primitives.id,
			primitives.category,
		);
	}
}
