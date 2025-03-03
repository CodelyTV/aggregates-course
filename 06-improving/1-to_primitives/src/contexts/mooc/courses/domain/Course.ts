import { Primitives } from "@codelytv/primitives-type";

import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { Clock } from "../../../shared/domain/Clock";

import { CourseCategoryAddedDomainEvent } from "./CourseCategoryAddedDomainEvent";
import { CourseCategoryRemovedDomainEvent } from "./CourseCategoryRemovedDomainEvent";
import { CourseCreatedDomainEvent } from "./CourseCreatedDomainEvent";
import { CourseDeletedDomainEvent } from "./CourseDeletedDomainEvent";
import { CourseId } from "./CourseId";
import { CourseRenamedDomainEvent } from "./CourseRenamedDomainEvent";
import { CourseResummarizedDomainEvent } from "./CourseResummarizedDomainEvent";

export class Course extends AggregateRoot {
	static aggregateName = "codely.mooc.courses";

	constructor(
		readonly id: CourseId,
		public name: string,
		public summary: string,
		public categories: string[],
		readonly publishedAt: Date,
	) {
		super(Course.aggregateName, id.value);
	}

	static fromPrimitives(primitives: Primitives<Course>): Course {
		return new Course(
			new CourseId(primitives.id),
			primitives.name,
			primitives.summary,
			primitives.categories,
			new Date(primitives.publishedAt),
		);
	}

	static create(
		clock: Clock,
		id: string,
		name: string,
		summary: string,
		categories: string[],
	): Course {
		const publishedAt = clock.now();

		const course = Course.fromPrimitives({
			aggregateId: id,
			aggregateName: Course.aggregateName,
			id,
			name,
			summary,
			categories,
			publishedAt: publishedAt.getTime(),
		});

		course.record(
			new CourseCreatedDomainEvent(
				id,
				name,
				summary,
				categories,
				publishedAt,
			),
		);

		return course;
	}

	toPrimitives(): Primitives<Course> {
		return {
			aggregateId: this.aggregateId,
			aggregateName: this.aggregateName,
			id: this.id.value,
			name: this.name,
			summary: this.summary,
			categories: this.categories,
			publishedAt: this.publishedAt.getTime(),
		};
	}

	rename(newName: string): void {
		this.name = newName;

		this.record(new CourseRenamedDomainEvent(this.id.value, newName));
	}

	resummarize(newSummary: string): void {
		this.summary = newSummary;

		this.record(
			new CourseResummarizedDomainEvent(this.id.value, newSummary),
		);
	}

	hasCategory(category: string): boolean {
		return this.categories.includes(category);
	}

	addCategory(category: string): void {
		if (!this.hasCategory(category)) {
			this.categories.push(category);

			this.record(
				new CourseCategoryAddedDomainEvent(this.id.value, category),
			);
		}
	}

	removeCategory(category: string): void {
		const index = this.categories.indexOf(category);

		if (index !== -1) {
			this.categories.splice(index, 1);

			this.record(
				new CourseCategoryRemovedDomainEvent(this.id.value, category),
			);
		}
	}

	delete(): void {
		this.record(new CourseDeletedDomainEvent(this.id.value));
	}
}
