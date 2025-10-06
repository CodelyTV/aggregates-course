import "reflect-metadata";

import { NextRequest, NextResponse } from "next/server";

import {
	CourseBySimilarNameFinder,
	CourseBySimilarNameFinderErrors,
} from "../../../../../contexts/mooc/courses/application/find-by-similar-name/CourseBySimilarNameFinder";
import { container } from "../../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "../../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { withErrorHandling } from "../../../../../contexts/shared/infrastructure/http/withErrorHandling";

const finder = container.get(CourseBySimilarNameFinder);

export const GET = withErrorHandling(
	async (request: NextRequest): Promise<NextResponse> => {
		const name = request.nextUrl.searchParams.get("name");

		if (!name) {
			return HttpNextResponse.badRequest("Name parameter is required");
		}

		const course = await finder.find(name);

		return HttpNextResponse.json(course);
	},
	(error: CourseBySimilarNameFinderErrors) => {
		return HttpNextResponse.codelyError(error, 404);
	},
);
