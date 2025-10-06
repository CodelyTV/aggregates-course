import "reflect-metadata";

import { faker } from "@faker-js/faker";

import { Course } from "../../../../../src/contexts/mooc/courses/domain/Course";
import { PostgresCourseRepository } from "../../../../../src/contexts/mooc/courses/infrastructure/PostgresCourseRepository";
import { CourseSuggestion } from "../../../../../src/contexts/mooc/user-course-suggestions/domain/CourseSuggestion";
import { OllamaCourseSuggestionsGenerator } from "../../../../../src/contexts/mooc/user-course-suggestions/infrastructure/OllamaCourseSuggestionsGenerator";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../courses/domain/CourseMother";
import { UserCourseSuggestionsMother } from "../domain/UserCourseSuggestionsMother";

const connection = container.get(PostgresConnection);
const courseRepository = container.get(PostgresCourseRepository);
const generator = container.get(OllamaCourseSuggestionsGenerator);

describe.skip("OllamaCourseSuggestionsGenerator should", () => {
	let availableCourses: Course[];
	let completedCourses: Course[];
	let suggestions: CourseSuggestion[];

	beforeAll(async () => {
		await connection.truncateAll();

		availableCourses = CourseMother.codelyStyleCourses();
		await Promise.all(
			availableCourses.map((course) => courseRepository.save(course)),
		);

		completedCourses = faker.helpers.arrayElements(availableCourses, 3);
		const completedCourseIds = completedCourses.map(
			(course) => course.id.value,
		);

		suggestions = await generator.generate(
			UserCourseSuggestionsMother.withoutSuggestions(completedCourseIds),
		);
	}, 50000);

	afterAll(async () => {
		await connection.end();
	});

	it("suggest only 3 courses", () => {
		expect(suggestions.length).toBe(3);
	});

	it("suggest only existing courses", () => {
		const suggestedCourseIds = suggestions.map(
			(suggestion) => suggestion.courseId,
		);
		const availableCourseIds = availableCourses.map(
			(course) => course.id.value,
		);

		expect(availableCourseIds).toEqual(
			expect.arrayContaining(suggestedCourseIds),
		);
	});

	it("suggest only courses that have not been completed", () => {
		const suggestedCourseIds = suggestions.map(
			(suggestion) => suggestion.courseId,
		);
		const completedCourseIds = completedCourses.map(
			(course) => course.id.value,
		);

		expect(completedCourseIds).not.toEqual(
			expect.arrayContaining(suggestedCourseIds),
		);
	});
});
