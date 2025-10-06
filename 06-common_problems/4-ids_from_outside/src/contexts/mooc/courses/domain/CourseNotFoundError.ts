import { CodelyError } from "../../../shared/domain/CodelyError";

export class CourseNotFoundError extends CodelyError {
	readonly message = "CourseNotFoundError";

	constructor(readonly id: string) {
		super({ id });
	}
}
