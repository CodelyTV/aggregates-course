import { Course } from "./Course";
import { CourseId } from "./CourseId";

export abstract class CourseRepository {
	abstract save(course: Course): Promise<void>;

	abstract search(id: CourseId): Promise<Course | null>;

	abstract searchAll(): Promise<Course[]>;

	abstract searchAllPaginated(
		lastCourseId: CourseId | null,
	): Promise<Course[]>;

	abstract searchByIds(ids: CourseId[]): Promise<Course[]>;

	abstract searchSimilar(ids: CourseId[]): Promise<Course[]>;

	abstract searchBySimilarName(name: string): Promise<Course | null>;
}
