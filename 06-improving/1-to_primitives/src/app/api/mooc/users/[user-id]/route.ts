/* eslint-disable camelcase */
import "reflect-metadata";

import { NextResponse } from "next/server";

import {
	UserFinder,
	UserFinderErrors,
} from "../../../../../contexts/mooc/users/application/find/UserFinder";
import { UserRegistrar } from "../../../../../contexts/mooc/users/application/registrar/UserRegistrar";
import { container } from "../../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { executeWithErrorHandling } from "../../../../../contexts/shared/infrastructure/http/executeWithErrorHandling";
import { HttpNextResponse } from "../../../../../contexts/shared/infrastructure/http/HttpNextResponse";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ "user-id": string }> },
): Promise<NextResponse> {
	return executeWithErrorHandling(
		async () => {
			const finder = container.get(UserFinder);

			const userId = (await params)["user-id"];

			const user = await finder.find(userId);

			return NextResponse.json(user);
		},
		(error: UserFinderErrors) => {
			return HttpNextResponse.domainError(error, 404);
		},
	);
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ "user-id": string }> },
): Promise<NextResponse> {
	return executeWithErrorHandling(async () => {
		const registrar = container.get(UserRegistrar);

		const id = (await params)["user-id"];
		const { name, email, profile_picture } = (await request.json()) as {
			name: string;
			email: string;
			profile_picture: string;
		};

		await registrar.registrar(id, name, email, profile_picture);

		return HttpNextResponse.created();
	});
}
