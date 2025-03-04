import { Service } from "diod";

import { CourseRepository } from "../../domain/CourseRepository";
import { CourseResponse } from "../../domain/CourseResponse";

@Service()
export class CoursesByIdsSearcher {
	constructor(private readonly repository: CourseRepository) {}

	async search(ids: string[]): Promise<CourseResponse[]> {
		const courses = await this.repository.searchByIds(ids);

		return courses.map(
			(course) =>
				new CourseResponse(
					course.idValue(),
					course.nameValue(),
					course.summaryValue(),
					course.categoriesValue(),
				),
		);
	}
}
