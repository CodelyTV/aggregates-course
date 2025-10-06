import { CodelyError } from "../../../shared/domain/CodelyError";

export class UserDoesNotExistError extends CodelyError {
	readonly message = "UserDoesNotExistError";

	constructor(id: string) {
		super({ id });
	}
}
