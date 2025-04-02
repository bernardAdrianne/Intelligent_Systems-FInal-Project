import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	course: text('course').notNull(),
	age: integer('age')
});

