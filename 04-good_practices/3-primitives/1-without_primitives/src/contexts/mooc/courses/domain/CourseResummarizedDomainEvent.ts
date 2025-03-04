import { DomainEventAttributes } from "../../../shared/domain/event/DomainEvent";

import { CourseDomainEvent } from "./CourseDomainEvent";

export type CourseResummarizedDomainEventPrimitives = {
	id: string;
	summary: string;
};

export class CourseResummarizedDomainEvent extends CourseDomainEvent {
	static eventName = "codely.mooc.course.resummarized";

	constructor(
		public readonly id: string,
		public readonly summary: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(CourseResummarizedDomainEvent.eventName, id, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		attributes: DomainEventAttributes,
	): CourseResummarizedDomainEvent {
		return new CourseResummarizedDomainEvent(
			aggregateId,
			attributes.summary as string,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): CourseResummarizedDomainEventPrimitives {
		return {
			id: this.id,
			summary: this.summary,
		};
	}
}
