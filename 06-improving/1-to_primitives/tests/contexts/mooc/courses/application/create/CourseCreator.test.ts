import { CourseCreator } from "../../../../../../src/contexts/mooc/courses/application/create/CourseCreator";
import { MockClock } from "../../../../shared/infrastructure/MockClock";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { CourseCreatedDomainEventMother } from "../../domain/CourseCreatedDomainEventMother";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../domain/MockCourseRepository";

describe("CourseCreator should", () => {
	const clock = new MockClock();
	const repository = new MockCourseRepository();
	const eventBus = new MockEventBus();
	const courseCreator = new CourseCreator(clock, repository, eventBus);

	it("create a valid course", async () => {
		const expectedCourse = CourseMother.create();
		const expectedCoursePrimitives = expectedCourse.toPrimitives();

		const createdDomainEvent = CourseCreatedDomainEventMother.create(
			expectedCoursePrimitives,
		);

		clock.shouldGenerate(new Date(expectedCoursePrimitives.publishedAt));
		repository.shouldSave(expectedCourse);
		eventBus.shouldPublish([createdDomainEvent]);

		await courseCreator.create(
			expectedCoursePrimitives.id,
			expectedCoursePrimitives.name,
			expectedCoursePrimitives.summary,
			expectedCoursePrimitives.categories,
		);
	});
});
