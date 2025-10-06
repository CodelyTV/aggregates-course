import { CourseSuggestion } from "./CourseSuggestion";
import { UserCourseSuggestions } from "./UserCourseSuggestions";

export abstract class CourseSuggestionsGenerator {
	abstract generate(
		userCourseSuggestions: UserCourseSuggestions,
	): Promise<CourseSuggestion[]>;
}
