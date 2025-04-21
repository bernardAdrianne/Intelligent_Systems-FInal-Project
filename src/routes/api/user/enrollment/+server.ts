import { db } from '$lib/server/db';
import { enrollment } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

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
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
        
        const enollmentDet = await db
            .select()
            .from(enrollment)
            .where(eq(enrollment.userId, decoded.id));
        
        if (enollmentDet.length === 0) {
            return json({ success: false, message: 'You are not enrolled in any course.' }, { status: 404 });
        }
        
        return json({ success: true, data: enollmentDet[0] }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching enrollment:', error.message);
		return json({ success: false, message: 'Error fetching enrollment.' }, { status: 500 });
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
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };

		const { courseId } = await request.json();

		if (!courseId) {
			return json({ success: false, message: 'Course ID are required.' }, { status: 400 });
		}
		const existingEnrollment = await db
			.select()
			.from(enrollment)
			.where(eq(enrollment.userId, decoded.id));

		if (existingEnrollment.length > 0) {
			return json({ success: false, message: 'You are already already enrolled in a course.' }, { status: 400 });
		}

		const newEnrollment = await db
            .insert(enrollment)
            .values({userId: decoded.id, courseId})
            .returning();

		return json({ success: true, message: 'Enrolled successfully.', data: newEnrollment }, { status: 200 });
	} catch (error: any) {
		console.error('Error enrolling student:', error.message);
		return json({ success: false, message: 'Error enrolling student.' }, { status: 500 });
	}
};


