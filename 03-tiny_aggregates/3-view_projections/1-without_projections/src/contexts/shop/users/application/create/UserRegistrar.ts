import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

export class UserRegistrar {
	constructor(private readonly repository: UserRepository) {}

	async create(id: string, name: string): Promise<void> {
		const product = User.create(id, name);

		await this.repository.save(product);
	}
}
