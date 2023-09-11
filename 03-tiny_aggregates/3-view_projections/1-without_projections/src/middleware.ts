import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

export async function middleware(request: NextRequest): Promise<NextResponse> {
	const response = NextResponse.next();
	const userId = request.cookies.get("user_id");

	if (!userId) {
		const newUserId = v4();
		await fetch(`http://localhost:3000/api/users/${newUserId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: "Javier Ferrer" }),
		});

		response.cookies.set("user_id", newUserId);
	}

	return response;
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|codely.svg).*)"] };
