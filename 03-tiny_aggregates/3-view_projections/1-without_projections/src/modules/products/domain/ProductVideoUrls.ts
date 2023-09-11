import { Collection } from "../../shared/domain/Collection";
import { ProductVideoUrl } from "./ProductVideoUrl";

export class ProductVideoUrls extends Collection<ProductVideoUrl> {
	static fromPrimitives(imageUrls: string[]): ProductVideoUrls {
		return new ProductVideoUrls(imageUrls.map((imageUrl) => new ProductVideoUrl(imageUrl)));
	}

	toJSON(): string {
		return JSON.stringify(this.toPrimitives());
	}

	toPrimitives(): string[] {
		return this.value.map((imageUrl) => imageUrl.value);
	}
}
