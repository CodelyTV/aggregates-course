import { Service } from "diod";

import { CoursesByIdsSearcher } from "../../../courses/application/search-by-ids/CoursesByIdsSearcher";
import { CourseSuggestions } from "../../../user-course-suggestions/domain/UserCourseSuggestionsGeneratedDomainEvent";
import { DomainUserFinder } from "../../domain/DomainUserFinder";
import { UserRepository } from "../../domain/UserRepository";

@Service()
export class UserCourseSuggestionsUpdater {
	constructor(
		private readonly finder: DomainUserFinder,
		private readonly repository: UserRepository,
		private readonly courseSearcher: CoursesByIdsSearcher,
	) {}

	async update(
		userId: string,
		suggestions: CourseSuggestions,
	): Promise<void> {
		const user = await this.finder.find(userId);

		const message = await this.generateSuggestionsMessage(suggestions);

		user.updateSuggestedCourses(message);

		await this.repository.save(user);
	}

	private async generateSuggestionsMessage(
		suggestions: CourseSuggestions,
	): Promise<string> {
		const courses = await this.courseSearcher.search(
			suggestions.map((suggestion) => suggestion.courseId),
		);

		return courses
			.map((course) => {
				const suggestion = suggestions.find(
					(suggestion) => suggestion.courseId === course.id,
				);

				return `- ${course.name} ${suggestion?.reason}.`;
			})
			.join("\n");
	}
}
