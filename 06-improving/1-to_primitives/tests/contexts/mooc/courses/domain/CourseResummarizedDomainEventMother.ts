import { faker } from "@faker-js/faker";

import {
	CourseResummarizedDomainEvent,
	CourseResummarizedDomainEventPrimitives,
} from "../../../../../src/contexts/mooc/courses/domain/CourseResummarizedDomainEvent";

import { CourseIdMother } from "./CourseIdMother";

export class CourseResummarizedDomainEventMother {
	static create(
		params?: Partial<CourseResummarizedDomainEventPrimitives>,
	): CourseResummarizedDomainEvent {
		const primitives: CourseResummarizedDomainEventPrimitives = {
			id: CourseIdMother.create().value,
			summary: faker.lorem.word(10),
			...params,
		};

		return new CourseResummarizedDomainEvent(
			primitives.id,
			primitives.summary,
		);
	}
}
