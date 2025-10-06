export function assertNever(_x: never): never {
	throw new Error("Assert never executed");
}
