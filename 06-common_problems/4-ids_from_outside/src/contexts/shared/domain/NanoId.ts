import { InvalidNanoIdError } from "./InvalidNanoIdError";
import { StringValueObject } from "./StringValueObject";

export abstract class NanoId extends StringValueObject {
	constructor(value: string) {
		super(value);

		this.ensureLengthIsValid(value);
	}

	private ensureLengthIsValid(value: string): void {
		if (value.length !== 4) {
			throw new InvalidNanoIdError(value);
		}
	}
}
