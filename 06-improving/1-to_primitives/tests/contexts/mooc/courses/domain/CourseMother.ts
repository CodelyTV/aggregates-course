import { Primitives } from "@codelytv/primitives-type";
import { faker } from "@faker-js/faker";

import { Course } from "../../../../../src/contexts/mooc/courses/domain/Course";

import { CourseIdMother } from "./CourseIdMother";

export class CourseMother {
	static create(params?: Partial<Primitives<Course>>): Course {
		const id = CourseIdMother.create().value;

		const primitives: Primitives<Course> = {
			aggregateId: id,
			aggregateName: "codely.mooc.courses",
			id,
			name: faker.internet.domainWord(),
			summary: faker.lorem.word({ length: 10 }),
			categories: [faker.lorem.word()],
			publishedAt: faker.date.recent().getTime(),
			...params,
		};

		return Course.fromPrimitives(primitives);
	}
}
