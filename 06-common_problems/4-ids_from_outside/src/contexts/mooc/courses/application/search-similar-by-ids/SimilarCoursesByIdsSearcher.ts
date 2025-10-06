import { Primitives } from "@codelytv/primitives-type";
import { Service } from "diod";

import { InvalidNanoIdError } from "../../../../shared/domain/InvalidNanoIdError";
import { Course } from "../../domain/Course";
import { CourseId } from "../../domain/CourseId";
import { CourseRepository } from "../../domain/CourseRepository";

export type SimilarCoursesSearcherErrors = InvalidNanoIdError;

@Service()
export class SimilarCoursesByIdsSearcher {
	constructor(private readonly repository: CourseRepository) {}

	async search(ids: string[]): Promise<Primitives<Course>[]> {
		const courses = await this.repository.searchSimilar(
			ids.map((id) => new CourseId(id)),
		);

		return courses.map((course) => course.toPrimitives());
	}
}
