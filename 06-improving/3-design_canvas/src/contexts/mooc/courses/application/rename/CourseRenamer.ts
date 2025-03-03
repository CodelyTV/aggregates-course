import { Service } from "diod";

import { EventBus } from "../../../../shared/domain/event/EventBus";
import { CourseRepository } from "../../domain/CourseRepository";
import { DomainCourseFinder } from "../../domain/DomainCourseFinder";

@Service()
export class CourseRenamer {
	constructor(
		private readonly finder: DomainCourseFinder,
		private readonly repository: CourseRepository,
		private readonly eventBus: EventBus,
	) {}

	async rename(id: string, newName: string): Promise<void> {
		const course = await this.finder.find(id);

		course.rename(newName);

		await this.repository.save(course);
		await this.eventBus.publish(course.pullDomainEvents());
	}
}
