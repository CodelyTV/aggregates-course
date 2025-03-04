import { Course } from "../../../../../src/contexts/mooc/courses/domain/Course";

import { CourseCategoriesMother } from "./CourseCategoriesMother";
import { CourseIdMother } from "./CourseIdMother";
import { CourseNameMother } from "./CourseNameMother";
import { CourseSummaryMother } from "./CourseSummaryMother";

export class CourseMother {
	static create(
		id?: string,
		name?: string,
		summary?: string,
		categories?: string[],
	): Course {
		return new Course(
			id ?? CourseIdMother.create().value,
			name ?? CourseNameMother.create().value,
			summary ?? CourseSummaryMother.create().value,
			categories ?? CourseCategoriesMother.create().value(),
		);
	}
}
