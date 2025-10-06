import "reflect-metadata";

import { NextResponse } from "next/server";

import { AllCoursesSearcher } from "../../../../contexts/mooc/courses/application/search-all/AllCoursesSearcher";
import { container } from "../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { withErrorHandling } from "../../../../contexts/shared/infrastructure/http/withErrorHandling";

const searcher = container.get(AllCoursesSearcher);

export const GET = withErrorHandling(async (): Promise<NextResponse> => {
	const courses = await searcher.search();

	return HttpNextResponse.json(courses);
});
