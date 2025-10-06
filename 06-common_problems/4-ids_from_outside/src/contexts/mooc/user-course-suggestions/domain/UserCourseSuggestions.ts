import { Primitives } from "@codelytv/primitives-type";

import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

import { CourseSuggestion } from "./CourseSuggestion";
import { UserCourseSuggestionsGeneratedDomainEvent } from "./UserCourseSuggestionsGeneratedDomainEvent";

export class UserCourseSuggestions extends AggregateRoot {
	constructor(
		public readonly userId: string,
		public completedCourseIds: string[],
		public suggestions: CourseSuggestion[],
	) {
		super();
	}

	static fromPrimitives(
		primitives: Primitives<UserCourseSuggestions>,
	): UserCourseSuggestions {
		return new UserCourseSuggestions(
			primitives.userId,
			primitives.completedCourseIds,
			primitives.suggestions.map((suggestions) =>
				CourseSuggestion.fromPrimitives(suggestions),
			),
		);
	}

	static create(userId: string): UserCourseSuggestions {
		return new UserCourseSuggestions(userId, [], []);
	}

	addCompletedCourse(courseId: string): void {
		this.completedCourseIds.push(courseId);
	}

	updateSuggestions(suggestions: CourseSuggestion[]): void {
		this.suggestions = suggestions;

		this.record(
			new UserCourseSuggestionsGeneratedDomainEvent(
				this.userId,
				suggestions.map((suggestion) => suggestion.toPrimitives()),
			),
		);
	}

	toPrimitives(): Primitives<UserCourseSuggestions> {
		return {
			userId: this.userId,
			completedCourseIds: this.completedCourseIds,
			suggestions: this.suggestions.map((suggestion) =>
				suggestion.toPrimitives(),
			),
		};
	}

	hasCompleted(courseId: string): boolean {
		return this.completedCourseIds.includes(courseId);
	}
}
