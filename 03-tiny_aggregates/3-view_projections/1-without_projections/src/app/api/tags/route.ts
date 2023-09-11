import { NextResponse } from "next/server";

import { MariaDBConnection } from "../../../modules/shared/infrastructure/MariaDBConnection";
import { AllTagsSearcher } from "../../../modules/tags/application/search_all/AllTagsSearcher";
import { MySqlTagRepository } from "../../../modules/tags/infrastructure/MySqlTagRepository";

export async function GET(): Promise<NextResponse<{ id: string; name: string }[]> | Response> {
	const searcher = new AllTagsSearcher(new MySqlTagRepository(new MariaDBConnection()));

	const tags = await searcher.search();

	return NextResponse.json(tags.map((tag) => tag.toPrimitives()));
}
