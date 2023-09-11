import { Category } from "./Category";

export interface CategoryRepository {
	searchAll(): Promise<Category[]>;
}
