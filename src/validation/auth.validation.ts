import z from "zod";

export const loginSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(8, "Password must minimum 8 characters long.")
		.regex(/[a-z]/, "Password must contain at least 1 Lowercase Letter")
		.regex(/[A-Z]/, "Password must contain at least 1 Uppercase Letter")

		.regex(/[0-9]/, "Password must contain at least 1 Number")
		.regex(/[^A-Za-z0-9]/, "Password must contain at least 1 Special Character"),
});