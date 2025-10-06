/* eslint-disable @typescript-eslint/no-unsafe-function-type,no-console */
import { Service } from "diod";

import { DomainEvent } from "../../domain/event/DomainEvent";
import { DomainEventSubscriber } from "../../domain/event/DomainEventSubscriber";
import { EventBus } from "../../domain/event/EventBus";
import { container } from "../dependency-injection/diod.config";

@Service()
export class InMemoryEventBus implements EventBus {
	private readonly subscriptions: Map<
		string,
		{ subscriber: Function; name: string }[]
	> = new Map();

	async publish(events: DomainEvent[]): Promise<void> {
		const subscribers = container
			.findTaggedServiceIdentifiers<
				DomainEventSubscriber<DomainEvent>
			>("subscriber")
			.map((id) => container.get(id));

		this.registerSubscribers(subscribers);

		const executions: unknown[] = [];

		events.forEach((event) => {
			console.log(`\n📤 Sending event \`${event.eventName}\` to:`);
			const subscribers = this.subscriptions.get(event.eventName);

			if (subscribers) {
				subscribers.forEach((subscriber) => {
					console.log(`\t→ 💻 ${subscriber.name}`);
					executions.push(subscriber.subscriber(event));
				});
			}
		});

		await Promise.all(executions).catch((error) => {
			console.error("Executing subscriptions:", error);
		});
	}

	private registerSubscribers(
		subscribers: DomainEventSubscriber<DomainEvent>[],
	): void {
		subscribers.forEach((subscriber) => {
			subscriber.subscribedTo().forEach((event) => {
				this.subscribe(event.eventName, subscriber);
			});
		});
	}

	private subscribe(
		eventName: string,
		subscriber: DomainEventSubscriber<DomainEvent>,
	): void {
		const currentSubscriptions = this.subscriptions.get(eventName) ?? [];

		const subscription = {
			subscriber: subscriber.on.bind(subscriber),
			name: subscriber.name(),
		};

		const isDuplicate = currentSubscriptions.some(
			(sub) => sub.name === subscription.name,
		);

		if (!isDuplicate) {
			currentSubscriptions.push(subscription);
			this.subscriptions.set(eventName, currentSubscriptions);
		}
	}
}
