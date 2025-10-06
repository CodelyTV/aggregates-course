import { Service } from "diod";

import { EventBus } from "../../../../shared/domain/event/EventBus";
import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

@Service()
export class UserRegistrar {
	constructor(
		private readonly repository: UserRepository,
		private readonly eventBus: EventBus,
	) {}

	async registrar(
		id: string,
		name: string,
		bio: string,
		email: string,
	): Promise<void> {
		const user = User.create(id, name, bio, email);

		await this.repository.save(user);
		await this.eventBus.publish(user.pullDomainEvents());
	}
}
