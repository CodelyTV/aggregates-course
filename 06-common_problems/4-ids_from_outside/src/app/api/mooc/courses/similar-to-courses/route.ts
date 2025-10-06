import "reflect-metadata";

import { NextRequest, NextResponse } from "next/server";

import {
	SimilarCoursesByIdsSearcher,
	SimilarCoursesSearcherErrors,
} from "../../../../../contexts/mooc/courses/application/search-similar-by-ids/SimilarCoursesByIdsSearcher";
import { container } from "../../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "../../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { withErrorHandling } from "../../../../../contexts/shared/infrastructure/http/withErrorHandling";

const searcher = container.get(SimilarCoursesByIdsSearcher);

export const GET = withErrorHandling(
	async (request: NextRequest): Promise<NextResponse> => {
		const ids = request.nextUrl.searchParams.get("ids");

		if (!ids) {
			return HttpNextResponse.badRequest(
				"Missing required parameter: ids",
			);
		}

		const courseIds = ids.split(",").map((id) => id.trim());

		if (courseIds.length === 0) {
			return HttpNextResponse.badRequest(
				"At least one course id is required",
			);
		}

		const similarCourses = await searcher.search(courseIds);

		return HttpNextResponse.json(similarCourses);
	},
	(error: SimilarCoursesSearcherErrors) => {
		return HttpNextResponse.codelyError(error, 400);
	},
);
