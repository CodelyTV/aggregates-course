import { DomainEvent } from "../domain/event/DomainEvent";
import { DomainEventClass } from "../domain/event/DomainEventClass";

export interface DomainEventSubscriber<T extends DomainEvent> {
	on(domainEvent: T): Promise<void>;

	subscribedTo(): DomainEventClass[];

	name(): string;
}
