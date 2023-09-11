import { Tag } from "./Tag";

export interface TagRepository {
	searchAll(): Promise<Tag[]>;
}
