import { Service } from "diod";

import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { UserCourseSuggestionsGeneratedDomainEvent } from "../../../user-course-suggestions/domain/UserCourseSuggestionsGeneratedDomainEvent";

import { UserCourseSuggestionsUpdater } from "./UserCourseSuggestionsUpdater";

@Service()
export class UpdateUserCourseSuggestionsOnUserCourseSuggestionsGenerated
	implements DomainEventSubscriber<UserCourseSuggestionsGeneratedDomainEvent>
{
	constructor(private readonly updater: UserCourseSuggestionsUpdater) {}

	async on(event: UserCourseSuggestionsGeneratedDomainEvent): Promise<void> {
		await this.updater.update(event.userId, event.suggestions);
	}

	subscribedTo(): DomainEventClass[] {
		return [UserCourseSuggestionsGeneratedDomainEvent];
	}

	name(): string {
		return "codely.mooc.update_user_course_suggestions_on_user_course_suggestions_generated";
	}
}
