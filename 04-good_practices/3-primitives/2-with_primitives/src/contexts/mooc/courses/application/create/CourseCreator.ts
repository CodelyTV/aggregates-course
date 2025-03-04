import { Service } from "diod";

import { EventBus } from "../../../../shared/domain/event/EventBus";
import { Course } from "../../domain/Course";
import { CourseRepository } from "../../domain/CourseRepository";

@Service()
export class CourseCreator {
	constructor(
		private readonly repository: CourseRepository,
		private readonly eventBus: EventBus,
	) {}

	async create(
		id: string,
		name: string,
		summary: string,
		categories: string[],
	): Promise<void> {
		const course = Course.create(id, name, summary, categories);

		await this.repository.save(course);
		await this.eventBus.publish(course.pullDomainEvents());
	}
}
