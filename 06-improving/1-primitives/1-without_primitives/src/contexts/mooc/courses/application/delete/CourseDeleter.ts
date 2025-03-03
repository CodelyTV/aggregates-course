import { Service } from "diod";

import { EventBus } from "../../../../shared/domain/event/EventBus";
import { CourseId } from "../../domain/CourseId";
import { CourseRepository } from "../../domain/CourseRepository";
import { DomainCourseFinder } from "../../domain/DomainCourseFinder";

@Service()
export class CourseDeleter {
	constructor(
		private readonly finder: DomainCourseFinder,
		private readonly repository: CourseRepository,
		private readonly eventBus: EventBus,
	) {}

	async delete(id: string): Promise<void> {
		const course = await this.finder.find(id);

		course.delete();

		await this.repository.delete(new CourseId(id));
		await this.eventBus.publish(course.pullDomainEvents());
	}
}
