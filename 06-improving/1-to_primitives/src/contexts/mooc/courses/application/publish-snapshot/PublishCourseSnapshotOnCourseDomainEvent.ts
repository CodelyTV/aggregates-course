import { Service } from "diod";

import { DomainEventSubscriber } from "../../../../shared/application/DomainEventSubscriber";
import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { CourseDomainEvent } from "../../domain/CourseDomainEvent";

import { CourseSnapshotPublisher } from "./CourseSnapshotPublisher";

@Service()
export class PublishCourseSnapshotOnCourseDomainEvent
	implements DomainEventSubscriber<CourseDomainEvent>
{
	constructor(private readonly publisher: CourseSnapshotPublisher) {}

	async on(domainEvent: CourseDomainEvent): Promise<void> {
		await this.publisher.publish(domainEvent.aggregateId);
	}

	subscribedTo(): DomainEventClass[] {
		return [CourseDomainEvent];
	}

	name(): string {
		return "codely.mooc.publish_course_snapshot_on_course_domain_event";
	}
}
