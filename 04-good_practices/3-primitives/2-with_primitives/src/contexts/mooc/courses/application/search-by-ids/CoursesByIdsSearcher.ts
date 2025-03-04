import { Primitives } from "@codelytv/primitives-type";
import { Service } from "diod";

import { Course } from "../../domain/Course";
import { CourseRepository } from "../../domain/CourseRepository";

@Service()
export class CoursesByIdsSearcher {
	constructor(private readonly repository: CourseRepository) {}

	async search(ids: string[]): Promise<Primitives<Course>[]> {
		const courses = await this.repository.searchByIds(ids);

		return courses.map((course) => course.toPrimitives());
	}
}
