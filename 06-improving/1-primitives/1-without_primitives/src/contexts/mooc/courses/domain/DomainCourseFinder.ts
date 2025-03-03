import { Service } from "diod";

import { Course } from "./Course";
import { CourseDoesNotExistError } from "./CourseDoesNotExistError";
import { CourseId } from "./CourseId";
import { CourseRepository } from "./CourseRepository";

@Service()
export class DomainCourseFinder {
	constructor(private readonly repository: CourseRepository) {}

	async find(id: string): Promise<Course> {
		const course = await this.repository.search(new CourseId(id));

		if (course === null) {
			throw new CourseDoesNotExistError(id);
		}

		return course;
	}
}
