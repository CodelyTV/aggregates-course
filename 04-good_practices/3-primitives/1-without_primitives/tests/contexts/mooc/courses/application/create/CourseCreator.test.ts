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

		const createdDomainEvent = CourseCreatedDomainEventMother.create(
			expectedCourse.idValue(),
			expectedCourse.nameValue(),
			expectedCourse.summaryValue(),
			expectedCourse.categoriesValue(),
		);

		repository.shouldSave(expectedCourse);
		eventBus.shouldPublish([createdDomainEvent]);

		await courseCreator.create(
			expectedCourse.idValue(),
			expectedCourse.nameValue(),
			expectedCourse.summaryValue(),
			expectedCourse.categoriesValue(),
		);
	});
});
