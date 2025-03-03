import { Primitives } from "@codelytv/primitives-type";
import { faker } from "@faker-js/faker";

import { Course } from "../../../../../src/contexts/mooc/courses/domain/Course";

import { CourseIdMother } from "./CourseIdMother";

export class CourseMother {
	static create(params?: Partial<Primitives<Course>>): Course {
		const primitives: Primitives<Course> = {
			id: CourseIdMother.create().value,
			name: faker.internet.domainWord(),
			summary: faker.lorem.word({ length: 10 }),
			categories: [faker.lorem.word()],
			...params,
		};

		return Course.fromPrimitives(primitives);
	}
}
