import { MariaDBConnection } from "../../../shared/infrastructure/MariaDBConnection";
import { User } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

type DatabaseUser = {
	id: string;
	name: string;
	profile_picture: string;
};

export class MySqlUserRepository implements UserRepository {
	constructor(private readonly connection: MariaDBConnection) {}

	async save(product: User): Promise<void> {
		const query = `
			INSERT INTO shop__users (id, name, profile_picture)
			VALUES (
				'${product.id.value}',
				'${product.name.value}',
				'${product.profilePicture.value}'
			);`;

		await this.connection.execute(query);
	}

	async search(id: UserId): Promise<User | null> {
		const query = `SELECT id, name, profile_picture FROM shop__users WHERE id = '${id.value}';`;

		const result = await this.connection.searchOne<DatabaseUser>(query);

		if (!result) {
			return null;
		}

		return new User(result.id, result.name, result.profile_picture);
	}
}
