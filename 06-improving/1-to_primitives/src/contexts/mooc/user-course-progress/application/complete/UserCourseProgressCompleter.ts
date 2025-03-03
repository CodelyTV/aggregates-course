import { Service } from "diod";

import { EventBus } from "../../../../shared/domain/event/EventBus";
import { UserCourseProgressCompletedDomainEvent } from "../../domain/UserCourseProgressCompletedDomainEvent";

@Service()
export class UserCourseProgressCompleter {
	constructor(private readonly eventBus: EventBus) {}

	async complete(courseId: string, userId: string): Promise<void> {
		await this.eventBus.publish([
			new UserCourseProgressCompletedDomainEvent(courseId, userId),
		]);
	}
}
