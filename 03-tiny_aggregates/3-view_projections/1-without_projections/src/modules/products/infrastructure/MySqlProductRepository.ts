import { Category } from "../../categories/domain/Category";
import { Seller } from "../../sellers/domain/Seller";
import { MariaDBConnection } from "../../shared/infrastructure/MariaDBConnection";
import { Tag } from "../../tags/domain/Tag";
import { Product } from "../domain/Product";
import { ProductId } from "../domain/ProductId";
import { ProductRepository } from "../domain/ProductRepository";

type DatabaseProduct = {
	id: string;
	name: string;
	amount: number;
	currency: "EUR" | "USD";
	imageUrls: string;
	videoUrls: string;
	categories: string;
	sellers: string;
	tags: string;
};

export class MySqlProductRepository implements ProductRepository {
	constructor(private readonly connection: MariaDBConnection) {}

	// All should be inside a transaction
	async save(product: Product): Promise<void> {
		await this.createNonExistingCategories(product.categories);
		await this.createNonExistingSellers(product.sellers);
		await this.createNonExistingTags(product.tags);
		await this.insertProduct(product);
	}

	async search(id: ProductId): Promise<Product | null> {
		const query = `
		SELECT 
			p.id,
			p.name,
			p.price_amount as amount,
			p.price_currency as currency,
			p.image_urls as imageUrls,
			p.video_urls as videoUrls,
			JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'name', c.name)) as categories,
			JSON_ARRAYAGG(JSON_OBJECT('id', s.id, 'name', s.name)) as sellers,
			JSON_ARRAYAGG(JSON_OBJECT('id', t.id, 'name', t.name)) as tags
		FROM products p
		LEFT JOIN product_categories pc ON p.id = pc.product_id
		LEFT JOIN categories c ON pc.category_id = c.id
		LEFT JOIN product_sellers ps ON p.id = ps.product_id
		LEFT JOIN sellers s ON ps.seller_id = s.id
		LEFT JOIN product_tags pt ON p.id = pt.product_id
		LEFT JOIN tags t ON pt.tag_id = t.id
		WHERE p.id='${id.value}'
		GROUP BY p.id
	`;

		const result = await this.connection.searchOne<DatabaseProduct>(query);

		if (!result) {
			return null;
		}

		return new Product(
			result.id,
			result.name,
			{
				amount: result.amount,
				currency: result.currency,
			},
			result.imageUrls as unknown as string[],
			result.videoUrls as unknown as string[],
			result.categories as unknown as { id: string; name: string }[],
			result.sellers as unknown as { id: string; name: string }[],
			result.tags as unknown as { id: string; name: string }[],
		);
	}

	async searchAll(): Promise<Product[]> {
		const query = `
		SELECT 
			p.id,
			p.name,
			p.price_amount as amount,
			p.price_currency as currency,
			p.image_urls as imageUrls,
			p.video_urls as videoUrls,
			JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'name', c.name)) as categories,
			JSON_ARRAYAGG(JSON_OBJECT('id', s.id, 'name', s.name)) as sellers,
			JSON_ARRAYAGG(JSON_OBJECT('id', t.id, 'name', t.name)) as tags
		FROM products p
		LEFT JOIN product_categories pc ON p.id = pc.product_id
		LEFT JOIN categories c ON pc.category_id = c.id
		LEFT JOIN product_sellers ps ON p.id = ps.product_id
		LEFT JOIN sellers s ON ps.seller_id = s.id
		LEFT JOIN product_tags pt ON p.id = pt.product_id
		LEFT JOIN tags t ON pt.tag_id = t.id
		GROUP BY p.id
	`;

		const result = await this.connection.searchAll<DatabaseProduct>(query);

		return result.map(
			(product) =>
				new Product(
					product.id,
					product.name,
					{
						amount: product.amount,
						currency: product.currency,
					},
					product.imageUrls as unknown as string[],
					product.videoUrls as unknown as string[],
					product.categories as unknown as { id: string; name: string }[],
					product.sellers as unknown as { id: string; name: string }[],
					product.tags as unknown as { id: string; name: string }[],
				),
		);
	}

	private async insertProduct(product: Product): Promise<void> {
		const query = `
			INSERT INTO products (id, name, price_amount, price_currency, image_urls, video_urls)
			VALUES (
				'${product.id.value}',
				'${product.name.value}',
				${product.price.amount},
				'${product.price.currency}', 
				'${product.imageUrls.toJSON()}',
				'${product.videoUrls.toJSON()}'
			);`;

		await this.connection.execute(query);

		await this.insertProductCategories(product.id, product.categories);
		await this.insertProductSellers(product.id, product.sellers);
		await this.insertProductTags(product.id, product.tags);
	}

	private async createNonExistingCategories(categories: Category[]) {
		const query = `
			INSERT IGNORE INTO categories (id, name)
			VALUES ${categories
				.map((category) => `('${category.id.value}', '${category.name.value}')`)
				.join(", ")}`;

		await this.connection.execute(query);
	}

	private async createNonExistingSellers(sellers: Seller[]) {
		const query = `
			INSERT IGNORE INTO sellers (id, name)
			VALUES ${sellers.map((seller) => `('${seller.id.value}', '${seller.name.value}')`).join(", ")}`;

		await this.connection.execute(query);
	}

	private async createNonExistingTags(tags: Tag[]) {
		const query = `
			INSERT IGNORE INTO tags (id, name)
			VALUES ${tags.map((tag) => `('${tag.id.value}', '${tag.name.value}')`).join(", ")}`;

		await this.connection.execute(query);
	}

	private async insertProductCategories(id: ProductId, categories: Category[]) {
		const query = `
			INSERT INTO product_categories (product_id, category_id)
			VALUES ${categories.map((category) => `('${id.value}', '${category.id.value}')`).join(", ")}`;

		await this.connection.execute(query);
	}

	private async insertProductSellers(id: ProductId, sellers: Seller[]) {
		const query = `
			INSERT INTO product_sellers (product_id, seller_id)
			VALUES ${sellers.map((seller) => `('${id.value}', '${seller.id.value}')`).join(", ")}`;

		await this.connection.execute(query);
	}

	private async insertProductTags(id: ProductId, tags: Tag[]) {
		const query = `
			INSERT INTO product_tags (product_id, tag_id)
			VALUES ${tags.map((tag) => `('${id.value}', '${tag.id.value}')`).join(", ")}`;

		await this.connection.execute(query);
	}
}
