import { Primitives } from "@codelytv/primitives-type";
import { faker } from "@faker-js/faker";

import { ShopCourse } from "../../../../../src/contexts/shop/courses/domain/ShopCourse";
import { CourseIdMother } from "../../../mooc/courses/domain/CourseIdMother";

export class ShopCourseMother {
	static create(params?: Partial<Primitives<ShopCourse>>): ShopCourse {
		const id = CourseIdMother.create().value;

		const primitives: Primitives<ShopCourse> = {
			aggregateId: id,
			aggregateName: "codely.shop.courses",
			id,
			name: faker.internet.domainWord(),
			summary: faker.lorem.word({ length: 10 }),
			categories: [faker.lorem.word()],
			publishedAt: faker.date.recent().getTime(),
			...params,
		};

		return ShopCourse.fromPrimitives(primitives);
	}
}
