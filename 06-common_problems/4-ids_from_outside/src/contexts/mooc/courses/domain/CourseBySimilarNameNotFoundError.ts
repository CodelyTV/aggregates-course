import { CodelyError } from "../../../shared/domain/CodelyError";

export class CourseBySimilarNameNotFoundError extends CodelyError {
	readonly message = "CourseBySimilarNameNotFoundError";

	constructor(readonly courseName: string) {
		super({ name: courseName });
	}
}
