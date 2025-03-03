import { CourseSnapshotPublisher } from "../../../../../../src/contexts/mooc/courses/application/publish-snapshot/CourseSnapshotPublisher";
import { PublishCourseSnapshotOnCourseDomainEvent } from "../../../../../../src/contexts/mooc/courses/application/publish-snapshot/PublishCourseSnapshotOnCourseDomainEvent";
import { CourseDomainEvent } from "../../../../../../src/contexts/mooc/courses/domain/CourseDomainEvent";
import { MockSnapshotPublisher } from "../../../../shared/infrastructure/MockSnapshotPublisher";
import { CourseCategoryAddedDomainEventMother } from "../../domain/CourseCategoryAddedDomainEventMother";
import { CourseCategoryRemovedDomainEventMother } from "../../domain/CourseCategoryRemovedDomainEventMother";
import { CourseCreatedDomainEventMother } from "../../domain/CourseCreatedDomainEventMother";
import { CourseDeletedDomainEventMother } from "../../domain/CourseDeletedDomainEventMother";
import { CourseIdMother } from "../../domain/CourseIdMother";
import { CourseMother } from "../../domain/CourseMother";
import { CourseRenamedDomainEventMother } from "../../domain/CourseRenamedDomainEventMother";
import { CourseResummarizedDomainEventMother } from "../../domain/CourseResummarizedDomainEventMother";
import { MockCourseRepository } from "../../domain/MockCourseRepository";

describe("PublishCourseSnapshotOnCourseDomainEvent should", () => {
	const repository = new MockCourseRepository();
	const snapshotPublisher = new MockSnapshotPublisher();
	const subscriber = new PublishCourseSnapshotOnCourseDomainEvent(
		new CourseSnapshotPublisher(repository, snapshotPublisher),
	);

	it.each([
		["created", CourseCreatedDomainEventMother.create()],
		["renamed", CourseRenamedDomainEventMother.create()],
		["resummarized", CourseResummarizedDomainEventMother.create()],
		["category added", CourseCategoryAddedDomainEventMother.create()],
		["category removed", CourseCategoryRemovedDomainEventMother.create()],
	])(
		"publish a valid course snapshot on course %s",
		async (_name, event: CourseDomainEvent) => {
			const course = CourseMother.create({
				id: event.aggregateId,
			});
			const coursePrimitives = course.toPrimitives();

			repository.shouldSearch(course);
			snapshotPublisher.shouldPublish(coursePrimitives);

			await subscriber.on(event);
		},
	);

	it("publish a course deletion on course deleted", async () => {
		const event = CourseDeletedDomainEventMother.create();

		repository.shouldSearchAndReturnNull(CourseIdMother.create(event.id));
		snapshotPublisher.shouldDelete(event.id, "codely.mooc.courses");

		await subscriber.on(event);
	});
});
