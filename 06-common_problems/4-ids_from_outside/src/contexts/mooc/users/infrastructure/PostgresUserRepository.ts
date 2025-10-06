import { Service } from "diod";

import { PostgresRepository } from "../../../shared/infrastructure/postgres/PostgresRepository";
import { User } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

type DatabaseUserRow = {
	id: string;
	name: string;
	bio: string;
	email: string;
	suggested_courses: string;
};

@Service()
export class PostgresUserRepository
	extends PostgresRepository<User>
	implements UserRepository
{
	async save(user: User): Promise<void> {
		const userPrimitives = user.toPrimitives();

		await this.execute`
			INSERT INTO mooc.users (id, name, bio, email, suggested_courses)
			VALUES (
				${userPrimitives.id},
				${userPrimitives.name},
				${userPrimitives.bio},
				${userPrimitives.email},
				${userPrimitives.suggestedCourses}
			)
			ON CONFLICT (id) DO UPDATE SET
				name = EXCLUDED.name,
				bio = EXCLUDED.bio,
				email = EXCLUDED.email,
				suggested_courses = EXCLUDED.suggested_courses;
		`;
	}

	async search(id: UserId): Promise<User | null> {
		return await this.searchOne`
			SELECT id, name, bio, email, suggested_courses
			FROM mooc.users
			WHERE id = ${id.value};
		`;
	}

	protected toAggregate(row: DatabaseUserRow): User {
		return User.fromPrimitives({
			id: row.id,
			name: row.name,
			bio: row.bio,
			email: row.email,
			suggestedCourses: row.suggested_courses,
		});
	}
}
