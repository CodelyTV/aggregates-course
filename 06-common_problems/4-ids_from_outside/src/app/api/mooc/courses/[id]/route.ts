import "reflect-metadata";

import { NextRequest, NextResponse } from "next/server";

import { CourseFinder } from "../../../../../contexts/mooc/courses/application/find/CourseFinder";
import { container } from "../../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "../../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { withErrorHandling } from "../../../../../contexts/shared/infrastructure/http/withErrorHandling";

const finder = container.get(CourseFinder);

export const GET = withErrorHandling(
	async (
		_request: NextRequest,
		{ params }: { params: Promise<{ id: string }> },
	): Promise<NextResponse> => {
		const resolvedParams = await params;
		const course = await finder.find(resolvedParams.id);

		return HttpNextResponse.json(course);
	},
);
