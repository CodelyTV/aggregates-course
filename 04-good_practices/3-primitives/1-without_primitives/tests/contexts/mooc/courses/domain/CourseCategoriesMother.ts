import { faker } from "@faker-js/faker";

import { CourseCategories } from "../../../../../src/contexts/mooc/courses/domain/CourseCategories";

import { CourseCategoryMother } from "./CourseCategoryMother";

export class CourseCategoriesMother {
	static create(value?: string[]): CourseCategories {
		return new CourseCategories(
			value ??
				faker.helpers.multiple(
					() => CourseCategoryMother.create().value,
					{ count: faker.number.int({ min: 1, max: 5 }) },
				),
		);
	}
}
