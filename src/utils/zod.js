const { z } = require("zod");

const zodSignInSchema = z
	.object({
		email: z.string().email(),
		password: z.string(),
	})
	.strict()
	.required();

const zodSignUpSchema = z
	.object({
		fname: z.string().trim().min(3),
		lname: z.string().trim().min(3),
		email: z.string().email(),
		password: z.string().min(8),
	})
	.strict()
	.required();

const zodTodoSchema = z
	.object({
		title: z.string().trim().min(3).max(50),
		description: z.string().trim().max(500),
		priority: z.number().positive().gte(1).lte(4),
		endsAt: z.coerce.date(),
	})
	.strict()
	.partial({ description: true, priority: true, endsAt: true });

const zodProjectSchema = z
	.object({
		title: z.string().min(3).max(50).trim(),
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
		isFavorite: z.boolean(),
	})
	.strict()
	.partial({ color: true, isFavorite: true });

const zodEnvSchema = z.object({
	PORT: z.coerce.number().positive(),
	MONGODB_URI: z.string(),
	JWT_USER: z.string(),
	NODE_ENV: z.enum(["development", "production"]),
	ALLOWED_ORIGINS: z.string(),
});

module.exports = {
	zodEnvSchema,
	zodTodoSchema,
	zodSignInSchema,
	zodSignUpSchema,
	zodProjectSchema,
};
