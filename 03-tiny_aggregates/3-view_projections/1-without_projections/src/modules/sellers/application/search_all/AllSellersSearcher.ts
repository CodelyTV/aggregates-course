import { Seller } from "../../domain/Seller";
import { SellerRepository } from "../../domain/SellerRepository";

export class AllSellersSearcher {
	constructor(private readonly repository: SellerRepository) {}

	async search(): Promise<Seller[]> {
		return this.repository.searchAll();
	}
}
