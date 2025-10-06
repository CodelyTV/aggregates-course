import { Primitives } from "@codelytv/primitives-type";
import { Service } from "diod";

import { InvalidNanoIdError } from "../../../../shared/domain/InvalidNanoIdError";
import { Course } from "../../domain/Course";
import { CourseId } from "../../domain/CourseId";
import { CourseNotFoundError } from "../../domain/CourseNotFoundError";
import { CourseRepository } from "../../domain/CourseRepository";

export type CourseByIdFinderErrors = CourseNotFoundError | InvalidNanoIdError;

@Service()
export class CourseFinder {
	constructor(private readonly repository: CourseRepository) {}

	async find(id: string): Promise<Primitives<Course>> {
		const course = await this.repository.search(new CourseId(id));

		if (!course) {
			throw new CourseNotFoundError(id);
		}

		return course.toPrimitives();
	}
}
