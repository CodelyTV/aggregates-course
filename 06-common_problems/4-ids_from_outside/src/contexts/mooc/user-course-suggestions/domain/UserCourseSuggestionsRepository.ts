import { UserId } from "../../users/domain/UserId";

import { UserCourseSuggestions } from "./UserCourseSuggestions";

export abstract class UserCourseSuggestionsRepository {
	abstract save(suggestions: UserCourseSuggestions): Promise<void>;

	abstract search(userId: UserId): Promise<UserCourseSuggestions | null>;
}
