import { CourseCreatedDomainEvent } from "../../../../../src/contexts/mooc/courses/domain/CourseCreatedDomainEvent";

import { CourseCategoriesMother } from "./CourseCategoriesMother";
import { CourseIdMother } from "./CourseIdMother";
import { CourseNameMother } from "./CourseNameMother";
import { CourseSummaryMother } from "./CourseSummaryMother";

export class CourseCreatedDomainEventMother {
	static create(
		id?: string,
		name?: string,
		summary?: string,
		categories?: string[],
	): CourseCreatedDomainEvent {
		return new CourseCreatedDomainEvent(
			id ?? CourseIdMother.create().value,
			name ?? CourseNameMother.create().value,
			summary ?? CourseSummaryMother.create().value,
			categories ?? CourseCategoriesMother.create().value(),
		);
	}
}
