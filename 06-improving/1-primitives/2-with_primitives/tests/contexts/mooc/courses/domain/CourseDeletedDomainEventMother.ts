import { CourseDeletedDomainEvent } from "../../../../../src/contexts/mooc/courses/domain/CourseDeletedDomainEvent";

import { CourseIdMother } from "./CourseIdMother";

export class CourseDeletedDomainEventMother {
	static create(id?: string): CourseDeletedDomainEvent {
		return new CourseDeletedDomainEvent(
			id ?? CourseIdMother.create().value,
		);
	}
}
