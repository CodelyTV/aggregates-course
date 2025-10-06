import { NextResponse } from "next/server";

import { CodelyError } from "../../domain/CodelyError";

export class HttpNextResponse {
	static codelyError(error: CodelyError, statusCode: number): NextResponse {
		return NextResponse.json(
			{
				error: error.toPrimitives(),
			},
			{ status: statusCode },
		);
	}

	static badRequest(message: string): NextResponse {
		return NextResponse.json(
			{
				error: {
					type: "InvalidRequest",
					description: message,
					params: {},
				},
			},
			{ status: 404 },
		);
	}

	static internalServerError(): NextResponse {
		return NextResponse.json(
			{
				type: "InternalServerError",
				description: "Internal server error",
				params: {},
			},
			{ status: 500 },
		);
	}

	static created(): NextResponse {
		return new NextResponse(null, { status: 201 });
	}

	static json<JsonBody>(data: JsonBody): NextResponse {
		return NextResponse.json(data, { status: 200 });
	}
}
