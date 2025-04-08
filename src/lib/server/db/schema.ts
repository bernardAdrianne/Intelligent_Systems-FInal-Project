import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	studentid: integer('studentid').notNull(),
	email:text('email').notNull(),
	course: text('course').notNull()
});

export const admin = sqliteTable('admin', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	password: text('password').notNull(),
	pfp: text('pfp').default('default.png'),
});

