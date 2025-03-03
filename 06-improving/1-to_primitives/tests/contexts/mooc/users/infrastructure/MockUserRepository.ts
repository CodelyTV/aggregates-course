import { User } from "../../../../../src/contexts/mooc/users/domain/User";
import { UserId } from "../../../../../src/contexts/mooc/users/domain/UserId";
import { UserRepository } from "../../../../../src/contexts/mooc/users/domain/UserRepository";

export class MockUserRepository implements UserRepository {
	private readonly mockSave = jest.fn();
	private readonly mockSearch = jest.fn();

	async save(user: User): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(user.toPrimitives());

		return Promise.resolve();
	}

	async search(id: UserId): Promise<User | null> {
		expect(this.mockSearch).toHaveBeenCalledWith(id);

		return this.mockSearch() as Promise<User | null>;
	}

	shouldSave(user: User): void {
		this.mockSave(user.toPrimitives());
	}

	shouldSearch(user: User): void {
		this.mockSearch(user.id);
		this.mockSearch.mockReturnValueOnce(user);
	}

	shouldSearchAndReturnNull(id: UserId): void {
		this.mockSearch(id);
		this.mockSearch.mockReturnValueOnce(null);
	}
}
