import { DomainError } from "../../../shared/domain/DomainError";

export class CourseDoesNotExistError extends DomainError {
	readonly type = "CourseDoesNotExistError";
	readonly message = `The course ${this.value} does not exist`;

	constructor(public readonly value: string) {
		super();
	}
}
