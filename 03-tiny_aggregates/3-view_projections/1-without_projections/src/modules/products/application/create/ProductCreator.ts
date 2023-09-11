import { Money } from "../../../shared/domain/Money";
import { Product } from "../../domain/Product";
import { ProductRepository } from "../../domain/ProductRepository";

export class ProductCreator {
	constructor(private readonly repository: ProductRepository) {}

	async create(
		id: string,
		name: string,
		price: Money,
		imageUrls: string[],
		videoUrls: string[],
		categories: { id: string; name: string }[],
		sellers: { id: string; name: string }[],
		tags: { id: string; name: string }[],
	): Promise<void> {
		const product = Product.create(
			id,
			name,
			price,
			imageUrls,
			videoUrls,
			categories,
			sellers,
			tags,
		);

		await this.repository.save(product);
	}
}
