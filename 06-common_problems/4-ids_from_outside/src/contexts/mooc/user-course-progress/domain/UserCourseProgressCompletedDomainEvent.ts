import {
	DomainEvent,
	DomainEventAttributes,
} from "../../../shared/domain/event/DomainEvent";

export type CourseProgressCompletedDomainEventPrimitives = {
	id: string;
	userId: string;
};

export class UserCourseProgressCompletedDomainEvent extends DomainEvent {
	static eventName = "codely.mooc.course_progress.completed";

	constructor(
		public readonly id: string,
		public readonly userId: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(
			UserCourseProgressCompletedDomainEvent.eventName,
			id,
			eventId,
			occurredOn,
		);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		attributes: DomainEventAttributes,
	): UserCourseProgressCompletedDomainEvent {
		return new UserCourseProgressCompletedDomainEvent(
			aggregateId,
			attributes.userId as string,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): CourseProgressCompletedDomainEventPrimitives {
		return {
			id: this.id,
			userId: this.userId,
		};
	}
}
