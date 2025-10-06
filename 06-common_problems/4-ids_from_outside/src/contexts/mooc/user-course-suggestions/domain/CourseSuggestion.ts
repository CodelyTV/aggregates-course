export type CourseSuggestionPrimitives = {
	courseId: string;
	reason: string;
};

export class CourseSuggestion {
	constructor(
		public readonly courseId: string,
		public readonly reason: string,
	) {}

	static fromPrimitives(
		primitives: CourseSuggestionPrimitives,
	): CourseSuggestion {
		return new CourseSuggestion(primitives.courseId, primitives.reason);
	}

	toPrimitives(): CourseSuggestionPrimitives {
		return {
			courseId: this.courseId,
			reason: this.reason,
		};
	}
}
