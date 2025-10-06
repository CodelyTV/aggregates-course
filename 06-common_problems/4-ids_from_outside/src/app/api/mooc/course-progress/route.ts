import "reflect-metadata";

import { NextResponse } from "next/server";

import { UserCourseProgressCompleter } from "../../../../contexts/mooc/user-course-progress/application/complete/UserCourseProgressCompleter";
import { UserFinder } from "../../../../contexts/mooc/users/application/find/UserFinder";
import { container } from "../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "../../../../contexts/shared/infrastructure/http/HttpNextResponse";

const completer = container.get(UserCourseProgressCompleter);
const userFinder = container.get(UserFinder);

export async function POST(request: Request): Promise<NextResponse> {
	const { courseId, userId } = (await request.json()) as {
		courseId: string;
		userId: string;
	};

	await completer.complete(courseId, userId);

	const user = await userFinder.find(userId);

	return HttpNextResponse.json({
		name: user.name,
		suggestedCourses: user.suggestedCourses,
	});
}
