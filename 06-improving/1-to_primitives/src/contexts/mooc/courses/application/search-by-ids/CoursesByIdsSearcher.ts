import { Primitives } from "@codelytv/primitives-type";
import { Service } from "diod";

import { Course } from "../../domain/Course";
import { CourseId } from "../../domain/CourseId";
import { CourseRepository } from "../../domain/CourseRepository";

@Service()
export class CoursesByIdsSearcher {
	constructor(private readonly repository: CourseRepository) {}

	async search(ids: string[]): Promise<Primitives<Course>[]> {
		const courses = await this.repository.searchByIds(
			ids.map((id) => new CourseId(id)),
		);

		return courses.map((course) => course.toPrimitives());
	}
}
