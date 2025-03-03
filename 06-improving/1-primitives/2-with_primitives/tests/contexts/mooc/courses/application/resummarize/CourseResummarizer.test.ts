import { faker } from "@faker-js/faker";

import { CourseResummarizer } from "../../../../../../src/contexts/mooc/courses/application/resummarize/CourseResummarizer";
import { CourseDoesNotExistError } from "../../../../../../src/contexts/mooc/courses/domain/CourseDoesNotExistError";
import { DomainCourseFinder } from "../../../../../../src/contexts/mooc/courses/domain/DomainCourseFinder";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { CourseIdMother } from "../../domain/CourseIdMother";
import { CourseMother } from "../../domain/CourseMother";
import { CourseResummarizedDomainEventMother } from "../../domain/CourseResummarizedDomainEventMother";
import { MockCourseRepository } from "../../domain/MockCourseRepository";

describe("CourseResummarizer should", () => {
	const repository = new MockCourseRepository();
	const eventBus = new MockEventBus();
	const courseResummarizer = new CourseResummarizer(
		new DomainCourseFinder(repository),
		repository,
		eventBus,
	);

	it("throws an error resummarizing a non existing course", async () => {
		const nonExistingCourseId = CourseIdMother.create();

		repository.shouldSearchAndReturnNull(nonExistingCourseId);

		await expect(async () => {
			await courseResummarizer.resummarize(
				nonExistingCourseId.value,
				faker.lorem.word(10),
			);
		}).rejects.toThrow(
			new CourseDoesNotExistError(nonExistingCourseId.value),
		);
	});

	it("resummarize an existing course", async () => {
		const existingCourse = CourseMother.create();
		const existingCoursePrimitives = existingCourse.toPrimitives();

		const newSummary = faker.lorem.word(10);
		const courseWithNewSummary = CourseMother.create({
			...existingCoursePrimitives,
			summary: newSummary,
		});

		const resummarizedDomainEvent =
			CourseResummarizedDomainEventMother.create({
				id: existingCoursePrimitives.id,
				summary: newSummary,
			});

		repository.shouldSearch(existingCourse);
		repository.shouldSave(courseWithNewSummary);
		eventBus.shouldPublish([resummarizedDomainEvent]);

		await courseResummarizer.resummarize(
			existingCoursePrimitives.id,
			newSummary,
		);
	});
});
