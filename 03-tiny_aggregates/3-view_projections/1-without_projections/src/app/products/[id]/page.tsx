import { ProductPrimitives } from "../../../modules/products/domain/Product";

export default async function ProductDetails({ params }: { params: { id: string } }) {
	async function getProduct(): Promise<ProductPrimitives> {
		"use server";

		return (await (
			await fetch(`http://localhost:3000/api/products/${params.id}`, { cache: "no-cache" })
		).json()) as ProductPrimitives;
	}

	const product = await getProduct();

	return (
		<>
			<h1>{product.name}</h1>
			<h2>
				Price: {product.price.amount} {product.price.currency}
			</h2>
		</>
	);
}
