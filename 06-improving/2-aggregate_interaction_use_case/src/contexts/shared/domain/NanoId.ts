import { StringValueObject } from "./StringValueObject";

export abstract class NanoId extends StringValueObject {
	constructor(value: string) {
		super(value);

		this.ensureLengthIsValid(value);
	}

	private ensureLengthIsValid(value: string): void {
		if (value.length !== 4) {
			throw new Error(
				`The NanoId <${value}> does not have a valid length`,
			);
		}
	}
}
