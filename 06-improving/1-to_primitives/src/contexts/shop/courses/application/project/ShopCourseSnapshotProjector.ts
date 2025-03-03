/* eslint-disable no-console */
import { Primitives } from "@codelytv/primitives-type";
import { Service } from "diod";

import { Course } from "../../../../mooc/courses/domain/Course";
import { CourseId } from "../../../../mooc/courses/domain/CourseId";
import { SnapshotProjector } from "../../../../shared/application/SnapshotProjector";
import { ShopCourse } from "../../domain/ShopCourse";
import { ShopCourseRepository } from "../../domain/ShopCourseRepository";

@Service()
export class ShopCourseSnapshotProjector implements SnapshotProjector<Course> {
	constructor(private readonly repository: ShopCourseRepository) {}

	async save(course: Primitives<Course>): Promise<void> {
		const shopCourse = ShopCourse.fromPrimitives(course);

		await this.repository.save(shopCourse);

		console.log(`Shop course ${shopCourse.id.value} projected`);
	}

	async delete(id: string): Promise<void> {
		await this.repository.delete(new CourseId(id));

		console.log(`Shop course ${id} deleted from projection`);
	}

	sourceAggregateName(): string {
		return Course.aggregateName;
	}

	projectorName(): string {
		return "codely.shop.courses.snapshot_projector";
	}
}
