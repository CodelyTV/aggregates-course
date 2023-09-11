import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { NextRequest, NextResponse } from "next/server";

import { ProductCreator } from "../../../../modules/products/application/create/ProductCreator";
import { ProductSearcher } from "../../../../modules/products/application/search/ProductSearcher";
import { ProductPrimitives } from "../../../../modules/products/domain/Product";
import { MySqlProductRepository } from "../../../../modules/products/infrastructure/MySqlProductRepository";
import { Money } from "../../../../modules/shared/domain/Money";
import { MariaDBConnection } from "../../../../modules/shared/infrastructure/MariaDBConnection";

const CreateProductRequest = t.type({
	name: t.string,
	price: t.type({
		amount: t.number,
		currency: t.union([t.literal("EUR"), t.literal("USD")]),
	}),
	imageUrls: t.array(t.string),
	videoUrls: t.array(t.string),
	categories: t.array(t.type({ id: t.string, name: t.string })),
	sellers: t.array(t.type({ id: t.string, name: t.string })),
	tags: t.array(t.type({ id: t.string, name: t.string })),
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
		body.videoUrls,
		body.categories,
		body.sellers,
		body.tags,
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
