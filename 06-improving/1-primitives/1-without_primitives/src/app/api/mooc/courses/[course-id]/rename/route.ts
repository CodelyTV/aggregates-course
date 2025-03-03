/* eslint-disable camelcase */
import "reflect-metadata";

import { NextResponse } from "next/server";

import { CourseRenamer } from "../../../../../../contexts/mooc/courses/application/rename/CourseRenamer";
import { container } from "../../../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { executeWithErrorHandling } from "../../../../../../contexts/shared/infrastructure/http/executeWithErrorHandling";
import { HttpNextResponse } from "../../../../../../contexts/shared/infrastructure/http/HttpNextResponse";

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ "course-id": string }> },
): Promise<NextResponse> {
	return executeWithErrorHandling(async () => {
		const renamer = container.get(CourseRenamer);

		const id = (await params)["course-id"];
		const { name } = (await request.json()) as {
			name: string;
		};

		await renamer.rename(id, name);

		return HttpNextResponse.noContent();
	});
}
