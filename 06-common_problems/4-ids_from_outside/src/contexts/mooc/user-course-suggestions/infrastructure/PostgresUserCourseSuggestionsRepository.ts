import { PostgresRepository } from "../../../shared/infrastructure/postgres/PostgresRepository";
import { UserId } from "../../users/domain/UserId";
import {
	CourseSuggestion,
	CourseSuggestionPrimitives,
} from "../domain/CourseSuggestion";
import { UserCourseSuggestions } from "../domain/UserCourseSuggestions";
import { UserCourseSuggestionsRepository } from "../domain/UserCourseSuggestionsRepository";

type DatabaseUserCourseSuggestionsRow = {
	user_id: string;
	completed_course_ids: string[];
	suggested_courses: CourseSuggestionPrimitives[];
};

export class PostgresUserCourseSuggestionsRepository
	extends PostgresRepository<UserCourseSuggestions>
	implements UserCourseSuggestionsRepository
{
	async save(user: UserCourseSuggestions): Promise<void> {
		const primitives = user.toPrimitives();

		await this.execute`
			INSERT INTO mooc.user_course_suggestions (user_id, completed_course_ids, suggested_courses)
			VALUES (
				${primitives.userId},
				${primitives.completedCourseIds},
				${primitives.suggestions}
			)
			ON CONFLICT (user_id) DO UPDATE SET
				completed_course_ids = EXCLUDED.completed_course_ids,
				suggested_courses = EXCLUDED.suggested_courses;
		`;
	}

	async search(id: UserId): Promise<UserCourseSuggestions | null> {
		return await this.searchOne`
			SELECT user_id, completed_course_ids, suggested_courses
			FROM mooc.user_course_suggestions
			WHERE user_id = ${id.value};
		`;
	}

	protected toAggregate(
		row: DatabaseUserCourseSuggestionsRow,
	): UserCourseSuggestions {
		return UserCourseSuggestions.fromPrimitives({
			userId: row.user_id,
			completedCourseIds: row.completed_course_ids,
			suggestions: row.suggested_courses.map((primitives) =>
				CourseSuggestion.fromPrimitives(primitives),
			),
		});
	}
}
