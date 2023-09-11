import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { NextRequest, NextResponse } from "next/server";

import { Money } from "../../../../contexts/shared/domain/Money";
import { MariaDBConnection } from "../../../../contexts/shared/infrastructure/MariaDBConnection";
import { ProductCreator } from "../../../../contexts/shop/products/application/create/ProductCreator";
import { ProductSearcher } from "../../../../contexts/shop/products/application/search/ProductSearcher";
import { ProductPrimitives } from "../../../../contexts/shop/products/domain/Product";
import { MySqlProductRepository } from "../../../../contexts/shop/products/infrastructure/MySqlProductRepository";

const CreateProductRequest = t.type({
	name: t.string,
	price: t.type({
		amount: t.number,
		currency: t.union([t.literal("EUR"), t.literal("USD")]),
	}),
	imageUrls: t.array(t.string),
});

export async function PUT(
	request: NextRequest,
	{ params: { id } }: { params: { id: string } },
): Promise<Response> {
	const validatedRequest = CreateProductRequest.decode(await request.json());

	if (isLeft(validatedRequest)) {
		return new Response(`Invalid request: ${PathReporter.report(validatedRequest).join("\n")}`, {
			status: 400,
		});
	}

	const body = validatedRequest.right;

	await new ProductCreator(new MySqlProductRepository(new MariaDBConnection())).create(
		id,
		body.name,
		body.price as Money,
		body.imageUrls,
	);

	return new Response("", { status: 201 });
}

export async function GET(
	_request: Request,
	{ params: { id } }: { params: { id: string } },
): Promise<NextResponse<ProductPrimitives> | Response> {
	const searcher = new ProductSearcher(new MySqlProductRepository(new MariaDBConnection()));

	const product = await searcher.search(id);

	if (product === null) {
		return new Response("", { status: 404 });
	}

	return NextResponse.json(product.toPrimitives());
}
