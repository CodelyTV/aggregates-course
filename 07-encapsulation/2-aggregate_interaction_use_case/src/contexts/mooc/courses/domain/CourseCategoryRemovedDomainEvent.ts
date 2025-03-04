import { DomainEventAttributes } from "../../../shared/domain/event/DomainEvent";

import { CourseDomainEvent } from "./CourseDomainEvent";

export type CourseCategoryRemovedDomainEventPrimitives = {
	id: string;
	category: string;
};

export class CourseCategoryRemovedDomainEvent extends CourseDomainEvent {
	static eventName = "codely.mooc.course.category_removed";

	constructor(
		public readonly id: string,
		public readonly category: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(
			CourseCategoryRemovedDomainEvent.eventName,
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
	): CourseCategoryRemovedDomainEvent {
		return new CourseCategoryRemovedDomainEvent(
			aggregateId,
			attributes.summary as string,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): CourseCategoryRemovedDomainEventPrimitives {
		return {
			id: this.id,
			category: this.category,
		};
	}
}
