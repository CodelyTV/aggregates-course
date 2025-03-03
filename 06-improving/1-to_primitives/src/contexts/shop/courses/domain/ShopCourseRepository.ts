import { CourseId } from "../../../mooc/courses/domain/CourseId";

import { ShopCourse } from "./ShopCourse";

export abstract class ShopCourseRepository {
	abstract save(course: ShopCourse): Promise<void>;

	abstract search(id: CourseId): Promise<ShopCourse | null>;

	abstract delete(id: CourseId): Promise<void>;
}
