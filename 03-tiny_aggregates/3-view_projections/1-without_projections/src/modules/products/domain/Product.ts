import { Category } from "../../categories/domain/Category";
import { Seller } from "../../sellers/domain/Seller";
import { Money } from "../../shared/domain/Money";
import { Tag } from "../../tags/domain/Tag";
import { ProductId } from "./ProductId";
import { ProductImageUrls } from "./ProductImageUrls";
import { ProductName } from "./ProductName";
import { ProductVideoUrls } from "./ProductVideoUrls";

export type ProductPrimitives = {
	id: string;
	name: string;
	price: {
		amount: number;
		currency: "EUR" | "USD";
	};
	videoUrls: string[];
	imageUrls: string[];
	categories: { id: string; name: string }[];
	sellers: { id: string; name: string }[];
	tags: { id: string; name: string }[];
};

export class Product {
	public readonly id: ProductId;
	public readonly name: ProductName;
	public readonly price: Money;
	public readonly imageUrls: ProductImageUrls;
	public readonly videoUrls: ProductVideoUrls;
	public readonly categories: Category[];
	public readonly sellers: Seller[];
	public readonly tags: Tag[];

	constructor(
		id: string,
		name: string,
		price: Money,
		imageUrls: string[],
		videoUrls: string[],
		categories: { id: string; name: string }[],
		sellers: { id: string; name: string }[],
		tags: { id: string; name: string }[],
	) {
		this.id = new ProductId(id);
		this.name = new ProductName(name);
		this.price = price;
		this.imageUrls = ProductImageUrls.fromPrimitives(imageUrls);
		this.videoUrls = ProductVideoUrls.fromPrimitives(videoUrls);
		this.categories = categories.map(({ id, name }) => new Category(id, name));
		this.sellers = sellers.map(({ id, name }) => new Seller(id, name));
		this.tags = tags.map(({ id, name }) => new Tag(id, name));
	}

	static create(
		id: string,
		name: string,
		price: Money,
		imageUrls: string[],
		videoUrls: string[],
		categories: { id: string; name: string }[],
		sellers: { id: string; name: string }[],
		tags: { id: string; name: string }[],
	): Product {
		return new Product(id, name, price, imageUrls, videoUrls, categories, sellers, tags);
	}

	toPrimitives(): ProductPrimitives {
		return {
			id: this.id.value,
			name: this.name.value,
			price: {
				amount: this.price.amount,
				currency: this.price.currency,
			},
			videoUrls: this.videoUrls.toPrimitives(),
			imageUrls: this.imageUrls.toPrimitives(),
			categories: this.categories.map((category) => {
				return { id: category.id.value, name: category.name.value };
			}),
			sellers: this.sellers.map((seller) => {
				return { id: seller.id.value, name: seller.name.value };
			}),
			tags: this.tags.map((tag) => {
				return { id: tag.id.value, name: tag.name.value };
			}),
		};
	}
}
