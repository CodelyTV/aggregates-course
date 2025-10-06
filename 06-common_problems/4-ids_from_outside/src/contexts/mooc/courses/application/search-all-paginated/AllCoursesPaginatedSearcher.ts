import { Primitives } from "@codelytv/primitives-type";
import { Service } from "diod";

import { InvalidBase64Error } from "../../../../shared/domain/InvalidBase64Error";
import { InvalidNanoIdError } from "../../../../shared/domain/InvalidNanoIdError";
import { Course } from "../../domain/Course";
import { CourseId } from "../../domain/CourseId";
import { CourseRepository } from "../../domain/CourseRepository";

export type AllCoursesPaginatedSearcherErrors =
	| InvalidBase64Error
	| InvalidNanoIdError;

@Service()
export class AllCoursesPaginatedSearcher {
	constructor(private readonly repository: CourseRepository) {}

	async search(cursor: string | null): Promise<Primitives<Course>[]> {
		const lastCourseId = cursor ? this.decodeCursor(cursor) : null;

		return (await this.repository.searchAllPaginated(lastCourseId)).map(
			(course) => course.toPrimitives(),
		);
	}

	private decodeCursor(cursor: string): CourseId {
		this.ensureValidBase64(cursor);

		const lastCourseId = Buffer.from(cursor, "base64").toString("utf-8");

		return new CourseId(lastCourseId);
	}

	private ensureValidBase64(cursor: string): void {
		if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cursor)) {
			throw new InvalidBase64Error(cursor);
		}
	}
}
