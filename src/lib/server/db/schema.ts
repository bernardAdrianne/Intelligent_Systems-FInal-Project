import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	email:text('email').notNull(),
	password: text('password').notNull(),
});

export const admin = sqliteTable('admin', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	password: text('password').notNull(),
	pfp: text('pfp').default('default.png'),
});

export const course = sqliteTable('course', {
	id: integer('id').primaryKey(),
	name: text('name').notNull()
});

export const enrollment = sqliteTable('enrollment', {
	id: integer('id').primaryKey(),
	userId: integer('user_id').notNull().references(() => user.id),
	courseId: integer('course_id').notNull().references(() => course.id),
});