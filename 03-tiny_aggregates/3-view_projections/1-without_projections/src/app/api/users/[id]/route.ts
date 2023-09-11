import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { NextRequest, NextResponse } from "next/server";

import { MariaDBConnection } from "../../../../modules/shared/infrastructure/MariaDBConnection";
import { UserRegistrar } from "../../../../modules/users/application/create/UserRegistrar";
import { UserSearcher } from "../../../../modules/users/application/search/UserSearcher";
import { UserPrimitives } from "../../../../modules/users/domain/User";
import { MySqlUserRepository } from "../../../../modules/users/infrastructure/MySqlUserRepository";

const CreateUserRequest = t.type({ name: t.string });

export async function PUT(
	request: NextRequest,
	{ params: { id } }: { params: { id: string } },
): Promise<Response> {
	const validatedRequest = CreateUserRequest.decode(await request.json());

	if (isLeft(validatedRequest)) {
		return new Response(`Invalid request: ${PathReporter.report(validatedRequest).join("\n")}`, {
			status: 400,
		});
	}

	const body = validatedRequest.right;

	await new UserRegistrar(new MySqlUserRepository(new MariaDBConnection())).create(id, body.name);

	return new Response("", { status: 201 });
}

export async function GET(
	_request: Request,
	{ params: { id } }: { params: { id: string } },
): Promise<NextResponse<UserPrimitives> | Response> {
	const searcher = new UserSearcher(new MySqlUserRepository(new MariaDBConnection()));

	const user = await searcher.search(id);

	if (user === null) {
		return new Response("", { status: 404 });
	}

	return NextResponse.json(user.toPrimitives());
}
