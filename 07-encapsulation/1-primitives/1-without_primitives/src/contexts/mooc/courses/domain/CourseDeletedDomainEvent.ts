import { DomainEventAttributes } from "../../../shared/domain/event/DomainEvent";

import { CourseDomainEvent } from "./CourseDomainEvent";

export type CourseDeletedDomainEventPrimitives = { id: string };

export class CourseDeletedDomainEvent extends CourseDomainEvent {
	static eventName = "codely.mooc.course.deleted";

	constructor(
		public readonly id: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(CourseDeletedDomainEvent.eventName, id, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		_attributes: DomainEventAttributes,
	): CourseDeletedDomainEvent {
		return new CourseDeletedDomainEvent(aggregateId, eventId, occurredOn);
	}

	toPrimitives(): CourseDeletedDomainEventPrimitives {
		return {
			id: this.id,
		};
	}
}
