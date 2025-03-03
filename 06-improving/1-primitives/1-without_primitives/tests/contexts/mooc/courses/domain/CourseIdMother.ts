import { faker } from "@faker-js/faker";

import { CourseId } from "../../../../../src/contexts/mooc/courses/domain/CourseId";

export class CourseIdMother {
	static create(value?: string): CourseId {
		return new CourseId(value ?? faker.string.nanoid(4));
	}
}
