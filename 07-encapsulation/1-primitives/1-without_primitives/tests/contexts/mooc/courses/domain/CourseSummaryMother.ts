import { faker } from "@faker-js/faker";

import { CourseSummary } from "../../../../../src/contexts/mooc/courses/domain/CourseSummary";

export class CourseSummaryMother {
	static create(value?: string): CourseSummary {
		return new CourseSummary(value ?? faker.lorem.sentence());
	}
}
