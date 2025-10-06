import { CodelyError } from "./CodelyError";

export class InvalidBase64Error extends CodelyError {
	readonly message = "InvalidBase64Error";

	constructor(cursor: string) {
		super({ cursor });
	}
}
