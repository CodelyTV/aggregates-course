/* eslint-disable camelcase */
import "reflect-metadata";

import { NextResponse } from "next/server";

import { CourseCreator } from "../../../../../contexts/mooc/courses/application/create/CourseCreator";
import { CourseDeleter } from "../../../../../contexts/mooc/courses/application/delete/CourseDeleter";
import { container } from "../../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { executeWithErrorHandling } from "../../../../../contexts/shared/infrastructure/http/executeWithErrorHandling";
import { HttpNextResponse } from "../../../../../contexts/shared/infrastructure/http/HttpNextResponse";

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ "course-id": string }> },
): Promise<NextResponse> {
	return executeWithErrorHandling(async () => {
		const creator = container.get(CourseCreator);

		const id = (await params)["course-id"];
		const { name, summary, categories } = (await request.json()) as {
			name: string;
			summary: string;
			categories: string[];
		};

		await creator.create(id, name, summary, categories);

		return HttpNextResponse.noContent();
	});
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ "course-id": string }> },
): Promise<NextResponse> {
	return executeWithErrorHandling(async () => {
		const deleter = container.get(CourseDeleter);

		const id = (await params)["course-id"];

		await deleter.delete(id);

		return HttpNextResponse.noContent();
	});
}
