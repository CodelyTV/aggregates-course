import { NextResponse } from "next/server";

import { AllCategoriesSearcher } from "../../../modules/categories/application/search_all/AllCategoriesSearcher";
import { MySqlCategoryRepository } from "../../../modules/categories/infrastructure/MySqlCategoryRepository";
import { MariaDBConnection } from "../../../modules/shared/infrastructure/MariaDBConnection";

export async function GET(): Promise<NextResponse<{ id: string; name: string }[]> | Response> {
	const searcher = new AllCategoriesSearcher(new MySqlCategoryRepository(new MariaDBConnection()));

	const categories = await searcher.search();

	return NextResponse.json(categories.map((category) => category.toPrimitives()));
}
