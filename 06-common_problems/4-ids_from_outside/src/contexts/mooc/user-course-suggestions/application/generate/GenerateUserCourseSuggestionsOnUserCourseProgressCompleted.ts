import { Service } from "diod";

import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { UserCourseProgressCompletedDomainEvent } from "../../../user-course-progress/domain/UserCourseProgressCompletedDomainEvent";

import { UserCourseSuggestionsGenerator } from "./UserCourseSuggestionsGenerator";

@Service()
export class GenerateUserCourseSuggestionsOnUserCourseProgressCompleted
	implements DomainEventSubscriber<UserCourseProgressCompletedDomainEvent>
{
	constructor(private readonly generator: UserCourseSuggestionsGenerator) {}

	async on(event: UserCourseProgressCompletedDomainEvent): Promise<void> {
		await this.generator.generate(event.userId, event.id);
	}

	subscribedTo(): DomainEventClass[] {
		return [UserCourseProgressCompletedDomainEvent];
	}

	name(): string {
		return "codely.mooc.generate_user_course_suggestions_on_user_course_progress_completed";
	}
}
