import { ShopCourseSnapshotProjector } from "../../../../../../src/contexts/shop/courses/application/project/ShopCourseSnapshotProjector";
import { CourseIdMother } from "../../../../mooc/courses/domain/CourseIdMother";
import { CourseMother } from "../../../../mooc/courses/domain/CourseMother";
import { MockShopCourseRepository } from "../../domain/MockShopCourseRepository";
import { ShopCourseMother } from "../../domain/ShopCourseMother";

describe("ShopCourseSnapshotProjector should", () => {
	const repository = new MockShopCourseRepository();
	const projector = new ShopCourseSnapshotProjector(repository);

	it("save a shop course projection", async () => {
		const snapshot = CourseMother.create().toPrimitives();

		const shopCourse = ShopCourseMother.create(snapshot);

		repository.shouldSave(shopCourse);

		await projector.save(snapshot);
	});

	it("delete a shop course projection", async () => {
		const id = CourseIdMother.create();

		repository.shouldDelete(id);

		await projector.delete(id.value);
	});
});
