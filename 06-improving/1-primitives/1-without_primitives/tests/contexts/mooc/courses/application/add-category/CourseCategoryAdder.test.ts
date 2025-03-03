import { faker } from "@faker-js/faker";

import { CourseCategoryAdder } from "../../../../../../src/contexts/mooc/courses/application/add-category/CourseCategoryAdder";
import { CourseDoesNotExistError } from "../../../../../../src/contexts/mooc/courses/domain/CourseDoesNotExistError";
import { DomainCourseFinder } from "../../../../../../src/contexts/mooc/courses/domain/DomainCourseFinder";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { CourseCategoryAddedDomainEventMother } from "../../domain/CourseCategoryAddedDomainEventMother";
import { CourseIdMother } from "../../domain/CourseIdMother";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../domain/MockCourseRepository";

describe("CourseCategoryAdder should", () => {
	const repository = new MockCourseRepository();
	const eventBus = new MockEventBus();
	const courseCategoryAdder = new CourseCategoryAdder(
		new DomainCourseFinder(repository),
		repository,
		eventBus,
	);

	it("throws an error adding a category to a non existing course", async () => {
		const nonExistingCourseId = CourseIdMother.create();

		repository.shouldSearchAndReturnNull(nonExistingCourseId);

		await expect(async () => {
			await courseCategoryAdder.add(
				nonExistingCourseId.value,
				faker.internet.domainWord(),
			);
		}).rejects.toThrow(
			new CourseDoesNotExistError(nonExistingCourseId.value),
		);
	});

	it("not add a category if already is added", async () => {
		const existingCategory = faker.internet.domainWord();
		const existingCourse = CourseMother.create({
			categories: [existingCategory],
		});
		const existingCoursePrimitives = existingCourse.toPrimitives();

		repository.shouldSearch(existingCourse);

		await courseCategoryAdder.add(
			existingCoursePrimitives.id,
			existingCategory,
		);
	});

	it("add a valid category", async () => {
		const existingCourse = CourseMother.create();
		const existingCoursePrimitives = existingCourse.toPrimitives();

		const newCategory = faker.internet.domainWord();
		const courseWithNewCategory = CourseMother.create({
			...existingCoursePrimitives,
			categories: [...existingCoursePrimitives.categories, newCategory],
		});

		const addedDomainEvent = CourseCategoryAddedDomainEventMother.create({
			id: existingCoursePrimitives.id,
			category: newCategory,
		});

		repository.shouldSearch(existingCourse);
		repository.shouldSave(courseWithNewCategory);
		eventBus.shouldPublish([addedDomainEvent]);

		await courseCategoryAdder.add(existingCoursePrimitives.id, newCategory);
	});
});
