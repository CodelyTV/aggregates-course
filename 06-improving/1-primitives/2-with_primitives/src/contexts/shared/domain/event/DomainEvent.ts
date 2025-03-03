import { v4 } from "uuid";

export type DomainEventAttributes = { [key: string]: unknown };

export abstract class DomainEvent {
	// eslint-disable-next-line @typescript-eslint/member-ordering
	static fromPrimitives: (
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		attributes: DomainEventAttributes,
		// eslint-disable-next-line no-use-before-define
	) => DomainEvent;

	public readonly eventId: string;
	public readonly occurredOn: Date;

	protected constructor(
		public readonly eventName: string,
		public readonly aggregateId: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		this.eventId = eventId ?? v4();
		this.occurredOn = occurredOn ?? new Date();
	}

	abstract toPrimitives(): DomainEventAttributes;
}
