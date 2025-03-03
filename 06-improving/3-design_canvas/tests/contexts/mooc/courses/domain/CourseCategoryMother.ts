import { faker } from "@faker-js/faker";

import { CourseCategory } from "../../../../../src/contexts/mooc/courses/domain/CourseCategory";

export class CourseCategoryMother {
	static create(value?: string): CourseCategory {
		return new CourseCategory(value ?? faker.lorem.word());
	}
}
