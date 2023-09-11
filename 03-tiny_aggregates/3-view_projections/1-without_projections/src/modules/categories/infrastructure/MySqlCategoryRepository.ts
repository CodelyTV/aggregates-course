import { MariaDBConnection } from "../../shared/infrastructure/MariaDBConnection";
import { Category } from "../domain/Category";
import { CategoryRepository } from "../domain/CategoryRepository";

export class MySqlCategoryRepository implements CategoryRepository {
	constructor(private readonly connection: MariaDBConnection) {}

	async searchAll(): Promise<Category[]> {
		const query = "SELECT id, name FROM categories";

		const results = await this.connection.searchAll<{ id: string; name: string }>(query);

		return results.map((result) => new Category(result.id, result.name));
	}
}
