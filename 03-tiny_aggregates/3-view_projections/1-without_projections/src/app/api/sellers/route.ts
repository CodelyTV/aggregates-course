import { NextResponse } from "next/server";

import { AllSellersSearcher } from "../../../modules/sellers/application/search_all/AllSellersSearcher";
import { MySqlSellerRepository } from "../../../modules/sellers/infrastructure/MySqlSellerRepository";
import { MariaDBConnection } from "../../../modules/shared/infrastructure/MariaDBConnection";

export async function GET(): Promise<NextResponse<{ id: string; name: string }[]> | Response> {
	const searcher = new AllSellersSearcher(new MySqlSellerRepository(new MariaDBConnection()));

	const sellers = await searcher.search();

	return NextResponse.json(sellers.map((seller) => seller.toPrimitives()));
}
