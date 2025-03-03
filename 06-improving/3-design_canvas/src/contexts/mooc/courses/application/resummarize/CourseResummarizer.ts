import { EventBus } from "../../../../shared/domain/event/EventBus";
import { CourseRepository } from "../../domain/CourseRepository";
import { DomainCourseFinder } from "../../domain/DomainCourseFinder";

export class CourseResummarizer {
	constructor(
		private readonly finder: DomainCourseFinder,
		private readonly repository: CourseRepository,
		private readonly eventBus: EventBus,
	) {}

	async resummarize(id: string, newSummary: string): Promise<void> {
		const course = await this.finder.find(id);

		course.resummarize(newSummary);

		await this.repository.save(course);
		await this.eventBus.publish(course.pullDomainEvents());
	}
}
