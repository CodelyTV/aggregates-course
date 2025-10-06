import { faker } from "@faker-js/faker";

import {
	CourseSuggestion,
	CourseSuggestionPrimitives,
} from "../../../../../src/contexts/mooc/user-course-suggestions/domain/CourseSuggestion";

export class CourseSuggestionMother {
	static create(
		params?: Partial<CourseSuggestionPrimitives>,
	): CourseSuggestion {
		const primitives: CourseSuggestionPrimitives = {
			courseId: faker.string.alpha(50),
			reason: faker.string.alpha(150),
			...params,
		};

		return CourseSuggestion.fromPrimitives(primitives);
	}
}
