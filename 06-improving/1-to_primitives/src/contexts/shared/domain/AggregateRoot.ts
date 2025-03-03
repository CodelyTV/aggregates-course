import { DomainEvent } from "./event/DomainEvent";

export abstract class AggregateRoot {
	private domainEvents: DomainEvent[] = [];

	protected constructor(
		public readonly aggregateName: string,
		public readonly aggregateId: string,
	) {}

	pullDomainEvents(): DomainEvent[] {
		const domainEvents = this.domainEvents;
		this.domainEvents = [];

		return domainEvents;
	}

	record(event: DomainEvent): void {
		this.domainEvents.push(event);
	}
}
