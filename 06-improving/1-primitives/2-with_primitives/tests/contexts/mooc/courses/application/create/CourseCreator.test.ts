import { CourseCreator } from "../../../../../../src/contexts/mooc/courses/application/create/CourseCreator";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { CourseCreatedDomainEventMother } from "../../domain/CourseCreatedDomainEventMother";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../domain/MockCourseRepository";

describe("CourseCreator should", () => {
	const repository = new MockCourseRepository();
	const eventBus = new MockEventBus();
	const courseCreator = new CourseCreator(repository, eventBus);

	it("create a valid course", async () => {
		const expectedCourse = CourseMother.create();
		const coursePrimitives = expectedCourse.toPrimitives();

		const createdDomainEvent =
			CourseCreatedDomainEventMother.create(coursePrimitives);

		repository.shouldSave(expectedCourse);
		eventBus.shouldPublish([createdDomainEvent]);

		await courseCreator.create(
			coursePrimitives.id,
			coursePrimitives.name,
			coursePrimitives.summary,
			coursePrimitives.categories,
		);
	});
});
