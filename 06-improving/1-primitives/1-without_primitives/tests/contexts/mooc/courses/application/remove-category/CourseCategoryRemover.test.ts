import { faker } from "@faker-js/faker";

import { CourseCategoryRemover } from "../../../../../../src/contexts/mooc/courses/application/remove-category/CourseCategoryRemover";
import { CourseDoesNotExistError } from "../../../../../../src/contexts/mooc/courses/domain/CourseDoesNotExistError";
import { DomainCourseFinder } from "../../../../../../src/contexts/mooc/courses/domain/DomainCourseFinder";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { CourseCategoryRemovedDomainEventMother } from "../../domain/CourseCategoryRemovedDomainEventMother";
import { CourseIdMother } from "../../domain/CourseIdMother";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../domain/MockCourseRepository";

describe("CourseCategoryRemover should", () => {
	const repository = new MockCourseRepository();
	const eventBus = new MockEventBus();
	const courseCategoryRemover = new CourseCategoryRemover(
		new DomainCourseFinder(repository),
		repository,
		eventBus,
	);

	it("throws an error removing a category to a non existing course", async () => {
		const nonExistingCourseId = CourseIdMother.create();

		repository.shouldSearchAndReturnNull(nonExistingCourseId);

		await expect(async () => {
			await courseCategoryRemover.remove(
				nonExistingCourseId.value,
				faker.internet.domainWord(),
			);
		}).rejects.toThrow(
			new CourseDoesNotExistError(nonExistingCourseId.value),
		);
	});

	it("don't remove a category if the course doesn't have it.", async () => {
		const existingCourse = CourseMother.create({});
		const existingCoursePrimitives = existingCourse.toPrimitives();

		const nonExistingCategory = faker.internet.domainWord();

		repository.shouldSearch(existingCourse);

		await courseCategoryRemover.remove(
			existingCoursePrimitives.id,
			nonExistingCategory,
		);
	});

	it("remove a valid category", async () => {
		const categoryToRemove = faker.internet.domainWord();
		const existingCategory = faker.internet.domainWord();

		const existingCourse = CourseMother.create({
			categories: [categoryToRemove, existingCategory],
		});
		const existingCoursePrimitives = existingCourse.toPrimitives();

		const courseWithoutCategory = CourseMother.create({
			...existingCoursePrimitives,
			categories: [existingCategory],
		});

		const expectedDomainEvent =
			CourseCategoryRemovedDomainEventMother.create({
				id: existingCoursePrimitives.id,
				category: categoryToRemove,
			});

		repository.shouldSearch(existingCourse);
		repository.shouldSave(courseWithoutCategory);
		eventBus.shouldPublish([expectedDomainEvent]);

		await courseCategoryRemover.remove(
			existingCoursePrimitives.id,
			categoryToRemove,
		);
	});
});
