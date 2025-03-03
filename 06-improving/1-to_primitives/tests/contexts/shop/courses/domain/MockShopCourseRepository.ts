import { CourseId } from "../../../../../src/contexts/mooc/courses/domain/CourseId";
import { ShopCourse } from "../../../../../src/contexts/shop/courses/domain/ShopCourse";
import { ShopCourseRepository } from "../../../../../src/contexts/shop/courses/domain/ShopCourseRepository";

export class MockShopCourseRepository implements ShopCourseRepository {
	private readonly mockSave = jest.fn();
	private readonly mockSearch = jest.fn();
	private readonly mockDelete = jest.fn();

	async save(course: ShopCourse): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(course.toPrimitives());

		return Promise.resolve();
	}

	async search(id: CourseId): Promise<ShopCourse | null> {
		expect(this.mockSearch).toHaveBeenCalledWith(id);

		return this.mockSearch() as Promise<ShopCourse | null>;
	}

	async delete(id: CourseId): Promise<void> {
		expect(this.mockDelete).toHaveBeenCalledWith(id);

		return Promise.resolve();
	}

	shouldSave(course: ShopCourse): void {
		this.mockSave(course.toPrimitives());
	}

	shouldSearch(course: ShopCourse): void {
		this.mockSearch(course.id);
		this.mockSearch.mockReturnValueOnce(course);
	}

	shouldSearchAndReturnNull(id: ShopCourse): void {
		this.mockSearch(id);
		this.mockSearch.mockReturnValueOnce(null);
	}

	shouldDelete(id: CourseId): void {
		this.mockDelete(id);
	}
}
