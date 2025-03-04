/* eslint-disable no-console */
import { NextResponse } from "next/server";

import { DomainError } from "../../domain/DomainError";

import { HttpNextResponse } from "./HttpNextResponse";

export async function executeWithErrorHandling<T extends DomainError>(
	fn: () => Promise<NextResponse>,
	onError: (error: T) => NextResponse | void = () => undefined,
): Promise<NextResponse> {
	try {
		return await fn();
	} catch (error: unknown) {
		if (error instanceof DomainError) {
			const response = onError(error as T);

			if (response) {
				return response;
			}
		}

		console.log(error);

		return HttpNextResponse.internalServerError();
	}
}
