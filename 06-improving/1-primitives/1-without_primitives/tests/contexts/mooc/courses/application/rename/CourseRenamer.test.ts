import { faker } from "@faker-js/faker";

import { CourseRenamer } from "../../../../../../src/contexts/mooc/courses/application/rename/CourseRenamer";
import { CourseDoesNotExistError } from "../../../../../../src/contexts/mooc/courses/domain/CourseDoesNotExistError";
import { DomainCourseFinder } from "../../../../../../src/contexts/mooc/courses/domain/DomainCourseFinder";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { CourseIdMother } from "../../domain/CourseIdMother";
import { CourseMother } from "../../domain/CourseMother";
import { CourseRenamedDomainEventMother } from "../../domain/CourseRenamedDomainEventMother";
import { MockCourseRepository } from "../../domain/MockCourseRepository";

describe("CourseRenamer should", () => {
	const repository = new MockCourseRepository();
	const eventBus = new MockEventBus();
	const courseRenamer = new CourseRenamer(
		new DomainCourseFinder(repository),
		repository,
		eventBus,
	);

	it("throws an error renaming a non existing course", async () => {
		const nonExistingCourseId = CourseIdMother.create();

		repository.shouldSearchAndReturnNull(nonExistingCourseId);

		await expect(async () => {
			await courseRenamer.rename(
				nonExistingCourseId.value,
				faker.internet.domainWord(),
			);
		}).rejects.toThrow(
			new CourseDoesNotExistError(nonExistingCourseId.value),
		);
	});

	it("rename an existing course", async () => {
		const existingCourse = CourseMother.create();
		const existingCoursePrimitives = existingCourse.toPrimitives();

		const newName = faker.internet.domainWord();
		const courseWithNewName = CourseMother.create({
			...existingCoursePrimitives,
			name: newName,
		});

		const renamedDomainEvent = CourseRenamedDomainEventMother.create({
			id: existingCoursePrimitives.id,
			name: newName,
		});

		repository.shouldSearch(existingCourse);
		repository.shouldSave(courseWithNewName);
		eventBus.shouldPublish([renamedDomainEvent]);

		await courseRenamer.rename(existingCoursePrimitives.id, newName);
	});
});
