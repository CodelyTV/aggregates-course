import { EventBus } from "../../../../shared/domain/event/EventBus";
import { CourseRepository } from "../../domain/CourseRepository";
import { DomainCourseFinder } from "../../domain/DomainCourseFinder";

export class CourseCategoryAdder {
	constructor(
		private readonly finder: DomainCourseFinder,
		private readonly repository: CourseRepository,
		private readonly eventBus: EventBus,
	) {}

	async add(id: string, category: string): Promise<void> {
		const course = await this.finder.find(id);

		if (!course.hasCategory(category)) {
			course.addCategory(category);

			await this.repository.save(course);
			await this.eventBus.publish(course.pullDomainEvents());
		}
	}
}
