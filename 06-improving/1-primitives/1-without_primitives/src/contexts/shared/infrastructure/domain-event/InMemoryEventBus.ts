/* eslint-disable @typescript-eslint/no-unsafe-function-type,no-console */
import { Service } from "diod";

import { DomainEventSubscriber } from "../../application/DomainEventSubscriber";
import { DomainEvent } from "../../domain/event/DomainEvent";
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

		const eventsExecutions = events.map(async (event) => {
			console.log(`\n📤 Sending event \`${event.eventName}\` to:`);
			const subscribers = this.getSubscribersForEvent(event.eventName);

			if (!subscribers.length) {
				console.log(`\t→ ❌ Nowhere. There are no subscribers.`);

				return;
			}

			return Promise.all(
				subscribers.map(async (subscriber) => {
					console.log(`\t→ 💻 ${subscriber.name}`);

					return subscriber.subscriber(event);
				}),
			);
		});

		await Promise.all(eventsExecutions).catch((error) => {
			console.error("Executing subscriptions:", error);
		});
	}

	private getSubscribersForEvent(
		eventName: string,
	): { subscriber: Function; name: string }[] {
		const subscribers: { subscriber: Function; name: string }[] = [];

		this.subscriptions.forEach((subs, pattern) => {
			if (this.matchesPattern(eventName, pattern)) {
				subscribers.push(...subs);
			}
		});

		return subscribers;
	}

	private matchesPattern(eventName: string, pattern: string): boolean {
		if (pattern.endsWith("*")) {
			const prefix = pattern.slice(0, -1);

			return eventName.startsWith(prefix);
		}

		return eventName === pattern;
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
