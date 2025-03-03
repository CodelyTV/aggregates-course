import { DomainEventAttributes } from "../../../shared/domain/event/DomainEvent";

import { CourseDomainEvent } from "./CourseDomainEvent";

export type CourseCategoryAddedDomainEventPrimitives = {
	id: string;
	category: string;
};

export class CourseCategoryAddedDomainEvent extends CourseDomainEvent {
	static eventName = "codely.mooc.course.category_added";

	constructor(
		public readonly id: string,
		public readonly category: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(
			CourseCategoryAddedDomainEvent.eventName,
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
	): CourseCategoryAddedDomainEvent {
		return new CourseCategoryAddedDomainEvent(
			aggregateId,
			attributes.summary as string,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): CourseCategoryAddedDomainEventPrimitives {
		return {
			id: this.id,
			category: this.category,
		};
	}
}
