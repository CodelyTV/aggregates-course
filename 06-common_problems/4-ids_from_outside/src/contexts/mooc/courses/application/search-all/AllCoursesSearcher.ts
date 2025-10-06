import { Primitives } from "@codelytv/primitives-type";
import { Service } from "diod";

import { Course } from "../../domain/Course";
import { CourseRepository } from "../../domain/CourseRepository";

@Service()
export class AllCoursesSearcher {
	constructor(private readonly repository: CourseRepository) {}

	async search(): Promise<Primitives<Course>[]> {
		return (await this.repository.searchAll()).map((course) =>
			course.toPrimitives(),
		);
	}
}
