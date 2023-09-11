import { Tag } from "../../domain/Tag";
import { TagRepository } from "../../domain/TagRepository";

export class AllTagsSearcher {
	constructor(private readonly repository: TagRepository) {}

	async search(): Promise<Tag[]> {
		return this.repository.searchAll();
	}
}
