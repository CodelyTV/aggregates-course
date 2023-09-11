import { Category } from "../../domain/Category";
import { CategoryRepository } from "../../domain/CategoryRepository";

export class AllCategoriesSearcher {
	constructor(private readonly repository: CategoryRepository) {}

	async search(): Promise<Category[]> {
		return this.repository.searchAll();
	}
}
