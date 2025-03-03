import { Primitives } from "@codelytv/primitives-type";

import { CourseId } from "../../../mooc/courses/domain/CourseId";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

export class ShopCourse extends AggregateRoot {
	static aggregateName = "codely.shop.courses";

	constructor(
		readonly id: CourseId,
		public name: string,
		public summary: string,
		public categories: string[],
		public publishedAt: Date,
	) {
		super(ShopCourse.aggregateName, id.value);
	}

	static fromPrimitives(primitives: Primitives<ShopCourse>): ShopCourse {
		return new ShopCourse(
			new CourseId(primitives.id),
			primitives.name,
			primitives.summary,
			primitives.categories,
			new Date(primitives.publishedAt),
		);
	}

	toPrimitives(): Primitives<ShopCourse> {
		return {
			aggregateId: this.aggregateId,
			aggregateName: this.aggregateName,
			id: this.id.value,
			name: this.name,
			summary: this.summary,
			categories: this.categories,
			publishedAt: this.publishedAt.getTime(),
		};
	}
}
