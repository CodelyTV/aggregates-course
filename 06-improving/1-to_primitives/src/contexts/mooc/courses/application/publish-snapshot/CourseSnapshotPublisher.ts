import { Service } from "diod";

import { SnapshotPublisher } from "../../../../shared/domain/SnapshotPublisher";
import { Course } from "../../domain/Course";
import { CourseId } from "../../domain/CourseId";
import { CourseRepository } from "../../domain/CourseRepository";

@Service()
export class CourseSnapshotPublisher {
	constructor(
		private readonly repository: CourseRepository,
		private readonly publisher: SnapshotPublisher,
	) {}

	async publish(id: string): Promise<void> {
		const course = await this.repository.search(new CourseId(id));

		if (course === null) {
			return await this.publisher.delete(id, Course.aggregateName);
		}

		const primitives = course.toPrimitives();

		await this.publisher.publish(primitives);
	}
}
