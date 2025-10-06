import { NextRequest } from "next/server";

import { CodelyError } from "../../domain/CodelyError";

import { HttpNextResponse } from "./HttpNextResponse";

export function withErrorHandling<T extends CodelyError, P = unknown>(
	fn: (request: NextRequest, params: P) => Promise<Response>,
	onError: (error: T) => Response | void = () => undefined,
) {
	return async function (request: NextRequest, params: P): Promise<Response> {
		try {
			return await fn(request, params);
		} catch (error: unknown) {
			console.error(error);

			if (error instanceof CodelyError) {
				const response = onError(error as T);

				if (response) {
					return response;
				}
			}

			return HttpNextResponse.internalServerError();
		}
	};
}
