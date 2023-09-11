import { MariaDBConnection } from "../../shared/infrastructure/MariaDBConnection";
import { Tag } from "../domain/Tag";
import { TagRepository } from "../domain/TagRepository";

export class MySqlTagRepository implements TagRepository {
	constructor(private readonly connection: MariaDBConnection) {}

	async searchAll(): Promise<Tag[]> {
		const query = "SELECT id, name FROM tags";

		const results = await this.connection.searchAll<{ id: string; name: string }>(query);

		return results.map((result) => new Tag(result.id, result.name));
	}
}
