import { DomainEventAttributes } from "../../../shared/domain/event/DomainEvent";

import { CourseDomainEvent } from "./CourseDomainEvent";

export type CourseRenamedDomainEventPrimitives = { id: string; name: string };

export class CourseRenamedDomainEvent extends CourseDomainEvent {
	static eventName = "codely.mooc.course.renamed";

	constructor(
		public readonly id: string,
		public readonly name: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(CourseRenamedDomainEvent.eventName, id, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		attributes: DomainEventAttributes,
	): CourseRenamedDomainEvent {
		return new CourseRenamedDomainEvent(
			aggregateId,
			attributes.name as string,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): CourseRenamedDomainEventPrimitives {
		return {
			id: this.id,
			name: this.name,
		};
	}
}
