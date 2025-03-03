import {
	DomainEvent,
	DomainEventAttributes,
} from "../../../shared/domain/event/DomainEvent";

export class CourseDomainEvent extends DomainEvent {
	static eventName = "codely.mooc.course.*";

	constructor(
		eventName: string,
		public readonly id: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(eventName, id, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		_attributes: DomainEventAttributes,
	): CourseDomainEvent {
		return new CourseDomainEvent(
			CourseDomainEvent.eventName,
			aggregateId,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): { [key: string]: unknown } {
		return {
			id: this.id,
		};
	}
}
