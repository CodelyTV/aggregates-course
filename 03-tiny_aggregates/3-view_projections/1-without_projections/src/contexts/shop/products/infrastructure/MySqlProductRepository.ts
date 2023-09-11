import { MariaDBConnection } from "../../../shared/infrastructure/MariaDBConnection";
import { Product } from "../domain/Product";
import { ProductFeaturedReviewPrimitives } from "../domain/ProductFeaturedReview";
import { ProductId } from "../domain/ProductId";
import { ProductRepository } from "../domain/ProductRepository";

type DatabaseProduct = {
	id: string;
	name: string;
	amount: number;
	currency: "EUR" | "USD";
	imageUrls: string;
	featuredReview: string | null;
	rating: number | null;
};

export class MySqlProductRepository implements ProductRepository {
	constructor(private readonly connection: MariaDBConnection) {}

	async save(product: Product): Promise<void> {
		const query = `
			INSERT INTO shop__products (id, name, price_amount, price_currency, image_urls)
			VALUES (
				'${product.id.value}',
				'${product.name.value}',
				${product.price.amount},
				'${product.price.currency}', 
				'${product.imageUrls.toJSON()}'
			);`;

		await this.connection.execute(query);
	}

	async search(id: ProductId): Promise<Product | null> {
		const query = `
	SELECT
		p.id,
		p.name,
		p.price_amount as amount,
		p.price_currency as currency,
		p.image_urls as imageUrls,
		AVG(r.rating) as rating,
		JSON_OBJECT('user_id', fr.user_id, 'rating', fr.rating, 'comment', fr.comment, 'is_featured', fr.is_featured) as featuredReview
	FROM shop__products p
			 LEFT JOIN shop__product_reviews r ON p.id = r.product_id
			 LEFT JOIN shop__product_reviews fr ON p.id = fr.product_id AND fr.is_featured = true
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
			(result.featuredReview as unknown as ProductFeaturedReviewPrimitives | null)?.rating
				? (result.featuredReview as unknown as ProductFeaturedReviewPrimitives)
				: null,
			result.rating as unknown as number,
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
			r.rating,
			JSON_OBJECT('user_id', r.user_id, 'rating', r.rating, 'comment', r.comment, 'is_featured', r.is_featured) as featuredReview
		FROM shop__products p
				 LEFT JOIN shop__product_reviews r ON p.id = r.product_id AND r.is_featured = true
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
					(product.featuredReview as unknown as ProductFeaturedReviewPrimitives | null)?.rating
						? (product.featuredReview as unknown as ProductFeaturedReviewPrimitives)
						: null,
					product.rating as unknown as number,
				),
		);
	}
}
