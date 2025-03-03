export class CourseResponse {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly summary: string,
		public readonly categories: string[],
	) {}
}
