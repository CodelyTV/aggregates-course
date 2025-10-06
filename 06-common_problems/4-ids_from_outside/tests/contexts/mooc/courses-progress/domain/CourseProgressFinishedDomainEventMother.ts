import {
	CourseProgressCompletedDomainEventPrimitives,
	UserCourseProgressCompletedDomainEvent,
} from "../../../../../src/contexts/mooc/user-course-progress/domain/UserCourseProgressCompletedDomainEvent";
import { UserIdMother } from "../../users/domain/UserIdMother";

export class CourseProgressCompletedDomainEventMother {
	static create(
		params?: Partial<CourseProgressCompletedDomainEventPrimitives>,
	): UserCourseProgressCompletedDomainEvent {
		const primitives: CourseProgressCompletedDomainEventPrimitives = {
			id: UserIdMother.create().value,
			userId: UserIdMother.create().value,
			...params,
		};

		return new UserCourseProgressCompletedDomainEvent(
			primitives.id,
			primitives.userId,
		);
	}
}
