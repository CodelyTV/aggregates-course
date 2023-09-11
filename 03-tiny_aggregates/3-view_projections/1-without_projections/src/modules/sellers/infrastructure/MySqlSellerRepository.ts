import { MariaDBConnection } from "../../shared/infrastructure/MariaDBConnection";
import { Seller } from "../domain/Seller";
import { SellerRepository } from "../domain/SellerRepository";

export class MySqlSellerRepository implements SellerRepository {
	constructor(private readonly connection: MariaDBConnection) {}

	async searchAll(): Promise<Seller[]> {
		const query = "SELECT id, name FROM sellers";

		const results = await this.connection.searchAll<{ id: string; name: string }>(query);

		return results.map((result) => new Seller(result.id, result.name));
	}
}
