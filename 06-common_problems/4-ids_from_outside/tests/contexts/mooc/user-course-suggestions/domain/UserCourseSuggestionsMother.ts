import { Primitives } from "@codelytv/primitives-type";
import { faker } from "@faker-js/faker";

import { UserCourseSuggestions } from "../../../../../src/contexts/mooc/user-course-suggestions/domain/UserCourseSuggestions";
import { UserIdMother } from "../../users/domain/UserIdMother";

import { CourseSuggestionMother } from "./CourseSuggestionMother";

export class UserCourseSuggestionsMother {
	static create(
		params?: Partial<Primitives<UserCourseSuggestions>>,
	): UserCourseSuggestions {
		const primitives: Primitives<UserCourseSuggestions> = {
			userId: UserIdMother.create().value,
			completedCourseIds: faker.helpers.multiple(
				() => faker.string.alpha(50),
				{
					count: {
						min: 1,
						max: 5,
					},
				},
			),
			suggestions: faker.helpers.multiple(
				() => CourseSuggestionMother.create(),
				{ count: 3 },
			),
			...params,
		};

		return UserCourseSuggestions.fromPrimitives(primitives);
	}

	static withoutSuggestions(
		completedCourses: string[],
	): UserCourseSuggestions {
		return this.create({
			suggestions: [],
			completedCourseIds: completedCourses,
		});
	}
}
