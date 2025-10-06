import { CodelyError } from "./CodelyError";

export class InvalidNanoIdError extends CodelyError {
	readonly message = "InvalidNanoIdError";

	constructor(readonly id: string) {
		super({ id });
	}
}
