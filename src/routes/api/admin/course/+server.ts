import { db } from '$lib/server/db';
import { course } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

import { blacklist } from '$lib/server/db/blacklist';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return json({ success: false, message: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    if (blacklist.has(token)) {
		return json({ success: false, message: 'Token has been revoked.' }, { status: 401 });
	}
    try {
        const courses = await db.select().from(course);

        return json({ success: true, data: courses }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching course:', error.message);
        return json({ success: false, message: 'Error fetching course.' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return json({ success: false, message: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    if (blacklist.has(token)) {
		return json({ success: false, message: 'Token has been revoked.' }, { status: 401 });
	}
    try {
        const { name } = await request.json();

        if (!name) {
            return json({ success: false, message: 'Course name is required.' }, { status: 400 });
        }

        const existingCourse = await db.select().from(course);

        if (existingCourse.length >= 2) {
            return json({ success: false, message: 'you can only have a maximum of 2 courses.' }, { status: 400 });
        }

        const duplicate = await db
            .select()
            .from(course)
            .where(eq(course.name, name));
        
        if (duplicate.length > 0) {
            return json({ success: false, message: 'Course with this name already exists.'}, { status: 400 });
        }
        
        const newCourse = await db
            .insert(course)
            .values({ name: name })
            .returning();

        return json({ success: true, message: 'Course added successfully.', data: newCourse }, { status: 200 });
    } catch (error: any) {
        console.error('Error adding course:', error.message);
        return json({ success: false, message: 'Error adding student.' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return json({ success: false, message: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    if (blacklist.has(token)) {
		return json({ success: false, message: 'Token has been revoked.' }, { status: 401 });
	}
    try {
        const { id } = await request.json();

        if (!id) {
            return json({ success: false, message: 'ID is required.' }, { status: 400 });
        }

        const existingCourse = await db
            .select()
            .from(course)
            .where(eq(course.id, id));

        if (existingCourse.length === 0) {
            return json({ success: false, message: 'ID does not exist.' });
        }

        const deletedCourse = await db
            .delete(course)
            .where(eq(course.id, id))
            .returning();

        return json({ success: true, message: 'Course deleted Successfully.' });
    } catch (error: any) {
        console.error('Error deleting course:', error.message);
        return json({ success: false, message: 'Error deleting course.' }, { status: 500 });
    }
};