import { Course } from "../../../../../src/contexts/mooc/courses/domain/Course";
import { CourseId } from "../../../../../src/contexts/mooc/courses/domain/CourseId";
import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";

export class MockCourseRepository implements CourseRepository {
	private readonly mockSave = jest.fn();
	private readonly mockSearch = jest.fn();
	private readonly mockSearchByIds = jest.fn();
	private readonly mockDelete = jest.fn();

	async save(course: Course): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(course.toPrimitives());

		return Promise.resolve();
	}

	async search(id: CourseId): Promise<Course | null> {
		expect(this.mockSearch).toHaveBeenCalledWith(id);

		return this.mockSearch() as Promise<Course | null>;
	}

	async searchByIds(ids: CourseId[]): Promise<Course[]> {
		expect(this.mockSearchByIds).toHaveBeenCalledWith(ids);

		return this.mockSearchByIds() as Promise<Course[]>;
	}

	async delete(id: CourseId): Promise<void> {
		expect(this.mockDelete).toHaveBeenCalledWith(id);

		return Promise.resolve();
	}

	shouldSave(course: Course): void {
		this.mockSave(course.toPrimitives());
	}

	shouldSearch(course: Course): void {
		this.mockSearch(course.id);
		this.mockSearch.mockReturnValueOnce(course);
	}

	shouldSearchAndReturnNull(id: CourseId): void {
		this.mockSearch(id);
		this.mockSearch.mockReturnValueOnce(null);
	}

	shouldDelete(id: CourseId): void {
		this.mockDelete(id);
	}
}
