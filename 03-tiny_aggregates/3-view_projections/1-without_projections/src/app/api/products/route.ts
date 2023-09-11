import { NextResponse } from "next/server";

import { AllProductsSearcher } from "../../../modules/products/application/search_all/AllProductsSearcher";
import { ProductPrimitives } from "../../../modules/products/domain/Product";
import { MySqlProductRepository } from "../../../modules/products/infrastructure/MySqlProductRepository";
import { MariaDBConnection } from "../../../modules/shared/infrastructure/MariaDBConnection";

export async function GET(): Promise<NextResponse<ProductPrimitives[]> | Response> {
	const searcher = new AllProductsSearcher(new MySqlProductRepository(new MariaDBConnection()));

	const products = await searcher.search();

	return NextResponse.json(products.map((product) => product.toPrimitives()));
}
