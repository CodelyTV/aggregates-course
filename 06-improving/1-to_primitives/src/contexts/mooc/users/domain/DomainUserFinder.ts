import { Service } from "diod";

import { User } from "./User";
import { UserDoesNotExistError } from "./UserDoesNotExistError";
import { UserId } from "./UserId";
import { UserRepository } from "./UserRepository";

@Service()
export class DomainUserFinder {
	constructor(private readonly repository: UserRepository) {}

	async find(id: string): Promise<User> {
		const user = await this.repository.search(new UserId(id));

		if (user === null) {
			throw new UserDoesNotExistError(id);
		}

		return user;
	}
}
