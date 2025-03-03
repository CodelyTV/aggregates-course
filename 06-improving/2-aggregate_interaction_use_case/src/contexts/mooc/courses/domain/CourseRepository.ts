import { Course } from "./Course";
import { CourseId } from "./CourseId";

export abstract class CourseRepository {
	abstract save(course: Course): Promise<void>;

	abstract search(id: CourseId): Promise<Course | null>;

	abstract searchByIds(ids: CourseId[]): Promise<Course[]>;

	abstract delete(id: CourseId): Promise<void>;
}
