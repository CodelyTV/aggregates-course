import { DomainError } from "../../../shared/domain/DomainError";

export class UserDoesNotExistError extends DomainError {
	readonly type = `UserDoesNotExistError`;
	readonly message = `The user ${this.value} does not exist`;

	constructor(public readonly value: string) {
		super();
	}
}
