const { z } = require("zod");

// strong password regex.
const strongPassword =
	/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

const zodSignInSchema = z
	.object({
		email: z.string().email(),
		password: z.string(),
	})
	.strict()
	.required();

// schema to match on sign-up request.
const zodSignUpSchema = z
	.object({
		fname: z.string().min(3).trim(),
		lname: z.string().min(3).trim(),
		email: z
			.string()
			.email({ message: "Invalid email address provided!" })
			.trim(),
		password: z
			.string()
			.min(8, { message: "Password must contain, minimum of 8 characters!" })
			.regex(strongPassword, {
				message: "Password is weak try using strong password!",
			}),
	})
	.strict()
	.required();

const zodTodoSchema = z
	.object({
		title: z.string().min(3).max(100).trim(),
		description: z
			.string()
			.max(500, {
				message: "description should be least then or equal to 500 character!",
			})
			.trim(),
		status: z.enum(["pending", "ongoing", "completed"], {
			message: "status can be pending, ongoing or completed!",
		}),
		priority: z
			.number()
			.positive({ message: "invalid priority value!" })
			.gte(1, { message: "priority must be between 1 to 4!" })
			.lte(4, { message: "priority must be between 1 to 4!" }),
		endsAt: z.coerce.date(),
	})
	.strict()
	.partial({ description: true, status: true, priority: true, endsAt: true });

const zodProjectSchema = z
	.object({
		color: z.enum([
			"#FF6666",
			"#F2A761",
			"#B5FF66",
			"#45E6BB",
			"#47B1B3",
			"#668FFF",
			"#B366FF",
			"#999999",
		]),
		title: z.string().min(3).max(100).trim(),
	})
	.strict()
	.partial({ color: true });

module.exports = {
	zodSignInSchema,
	zodSignUpSchema,
	zodTodoSchema,
	zodProjectSchema,
};
