import { CourseDeleter } from "../../../../../../src/contexts/mooc/courses/application/delete/CourseDeleter";
import { CourseDoesNotExistError } from "../../../../../../src/contexts/mooc/courses/domain/CourseDoesNotExistError";
import { DomainCourseFinder } from "../../../../../../src/contexts/mooc/courses/domain/DomainCourseFinder";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { CourseDeletedDomainEventMother } from "../../domain/CourseDeletedDomainEventMother";
import { CourseIdMother } from "../../domain/CourseIdMother";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../domain/MockCourseRepository";

describe("CourseDeleter should", () => {
	const repository = new MockCourseRepository();
	const eventBus = new MockEventBus();
	const courseDeleter = new CourseDeleter(
		new DomainCourseFinder(repository),
		repository,
		eventBus,
	);

	it("throws an error deleting a non existing course", async () => {
		const nonExistingCourseId = CourseIdMother.create();

		repository.shouldSearchAndReturnNull(nonExistingCourseId);

		await expect(async () => {
			await courseDeleter.delete(nonExistingCourseId.value);
		}).rejects.toThrow(
			new CourseDoesNotExistError(nonExistingCourseId.value),
		);
	});

	it("deletes an existing course", async () => {
		const existingCourse = CourseMother.create();
		const existingCoursePrimitives = existingCourse.toPrimitives();

		const domainEvent = CourseDeletedDomainEventMother.create(
			existingCoursePrimitives.id,
		);

		repository.shouldSearch(existingCourse);
		repository.shouldDelete(existingCourse.id);
		eventBus.shouldPublish([domainEvent]);

		await courseDeleter.delete(existingCoursePrimitives.id);
	});
});
