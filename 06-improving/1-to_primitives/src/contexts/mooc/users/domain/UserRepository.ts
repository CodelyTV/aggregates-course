import { User } from "./User";
import { UserId } from "./UserId";

export abstract class UserRepository {
	abstract save(user: User): Promise<void>;

	abstract search(id: UserId): Promise<User | null>;
}
