import { CourseCategory } from "./CourseCategory";

export class CourseCategories {
	readonly categories: CourseCategory[];

	constructor(value: string[]) {
		this.categories = value.map((category) => new CourseCategory(category));
	}

	static create(value: string[]): CourseCategories {
		return new CourseCategories(value);
	}

	includes(category: string): boolean {
		return this.categories.includes(new CourseCategory(category));
	}

	push(newCategory: string): CourseCategories {
		return new CourseCategories([
			...this.categories.map((category) => category.value),
			newCategory,
		]);
	}

	remove(categoryToRemove: string): CourseCategories {
		const filteredCategories = this.categories
			.filter((category) => category.value !== categoryToRemove)
			.map((category) => category.value);

		return new CourseCategories(filteredCategories);
	}

	value(): string[] {
		return this.categories.map((category) => category.value);
	}
}
