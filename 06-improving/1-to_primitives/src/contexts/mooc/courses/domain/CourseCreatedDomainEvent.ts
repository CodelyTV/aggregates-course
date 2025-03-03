import { DomainEventAttributes } from "../../../shared/domain/event/DomainEvent";

import { CourseDomainEvent } from "./CourseDomainEvent";

export class CourseCreatedDomainEvent extends CourseDomainEvent {
	static eventName = "codely.mooc.course.created";

	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly summary: string,
		public readonly categories: string[],
		public readonly publishedAt: Date,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(CourseCreatedDomainEvent.eventName, id, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		attributes: DomainEventAttributes,
	): CourseCreatedDomainEvent {
		return new CourseCreatedDomainEvent(
			aggregateId,
			attributes.name as string,
			attributes.summary as string,
			attributes.categories as string[],
			attributes.publishedAt as Date,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): DomainEventAttributes {
		return {
			id: this.id,
			name: this.name,
			summary: this.summary,
			categories: this.categories,
			publishedAt: this.publishedAt,
		};
	}
}
