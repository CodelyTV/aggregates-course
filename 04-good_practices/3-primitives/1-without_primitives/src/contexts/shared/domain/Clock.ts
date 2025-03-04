import { Service } from "diod";

export abstract class Clock {
	abstract now(): Date;
}

@Service()
export class SystemClock implements Clock {
	now(): Date {
		return new Date();
	}
}
