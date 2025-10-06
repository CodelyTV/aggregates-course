import { Primitives } from "@codelytv/primitives-type";
import { Service } from "diod";

import { Course } from "../../domain/Course";
import { CourseBySimilarNameNotFoundError } from "../../domain/CourseBySimilarNameNotFoundError";
import { CourseRepository } from "../../domain/CourseRepository";

export type CourseBySimilarNameFinderErrors = CourseBySimilarNameNotFoundError;

@Service()
export class CourseBySimilarNameFinder {
	constructor(private readonly repository: CourseRepository) {}

	async find(name: string): Promise<Primitives<Course>> {
		const course = await this.repository.searchBySimilarName(name);

		if (!course) {
			throw new CourseBySimilarNameNotFoundError(name);
		}

		return course.toPrimitives();
	}
}
