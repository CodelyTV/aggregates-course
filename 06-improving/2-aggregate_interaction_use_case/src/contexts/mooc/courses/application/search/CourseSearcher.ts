import { Primitives } from "@codelytv/primitives-type";
import { Service } from "diod";

import { Course } from "../../domain/Course";
import { CourseId } from "../../domain/CourseId";
import { CourseRepository } from "../../domain/CourseRepository";

@Service()
export class CourseSearcher {
	constructor(private readonly repository: CourseRepository) {}

	async search(id: string): Promise<Primitives<Course> | null> {
		const course = await this.repository.search(new CourseId(id));

		return course ? course.toPrimitives() : null;
	}
}
