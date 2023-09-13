import { User } from "../../domain/User";
import { UserId } from "../../domain/UserId";
import { UserRepository } from "../../domain/UserRepository";

export class UserFinder {
	constructor(private readonly repository: UserRepository) {}

	async find(id: string): Promise<User> {
		const user = await this.repository.search(new UserId(id));

		if (user === null) {
			throw new Error(`User ${id} not found`);
		}

		return user;
	}
}
