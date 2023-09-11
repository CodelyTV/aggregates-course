import { Seller } from "./Seller";

export interface SellerRepository {
	searchAll(): Promise<Seller[]>;
}
