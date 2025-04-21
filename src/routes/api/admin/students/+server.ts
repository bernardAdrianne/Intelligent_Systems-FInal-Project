import { db } from '$lib/server/db';
import { user, course, enrollment } from '$lib/server/db/schema';
import { eq, ilike, and } from 'drizzle-orm';

import  jwt  from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
 
import { blacklist } from '$lib/server/db/blacklist';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, url }) => {
	const authHeader = request.headers.get('authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return json({ success: false, message: 'Unauthorized. No token provided.' }, { status: 401 });
	}

	const token = authHeader.split(' ')[1];

	if (blacklist.has(token)) {
		return json({ success: false, message: 'Token has been revoked.' }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };

		const searchQuery = url.searchParams.get('q')?.toLowerCase();
		const courseFilter = url.searchParams.get('course')?.toLowerCase();

		let conditions = [];

		if (searchQuery) {
			conditions.push(
				ilike(user.name, `%${searchQuery}%`),
				ilike(user.email, `%${searchQuery}%`)
			);
		}

		if (courseFilter) {
			conditions.push(ilike(course.name, `%${courseFilter}%`));
		}

		const students = await db
			.select({
				id: user.id,
				name: user.name,
				email: user.email,
				course: course.name
			})
			.from(user)
			.innerJoin(enrollment, eq(user.id, enrollment.userId))
			.innerJoin(course, eq(course.id, enrollment.courseId))
			.where(
				conditions.length > 0 ? and(...conditions) : undefined
			);

		if (students.length === 0) {
			return json({ success: false, message: 'No students found.' }, { status: 404 });
		}

		return json({ success: true, data: students });
	} catch (error: any) {
		console.error('Error fetching students:', error);
		return json({ success: false, message: 'Error fetching students.', error: error.message }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return json({ success: false, message: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    if (blacklist.has(token)) {
        return json({ success: false, message: 'Token has been revoked.' }, { status: 401 });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };

        const { id, courseId } = await request.json();

        if (!id) {
            return json({ success: false, message: 'Student ID is required.' }, { status: 400 });
        }

        const existingStudent = await db.select().from(user).where(eq(user.id, id));
        if (existingStudent.length === 0) {
            return json({ success: false, message: 'Student not found.' }, { status: 404 });
        }

        const existingEnrollment = await db.select().from(enrollment).where(eq(enrollment.userId, id));

        if (courseId) {
            if (existingEnrollment.length > 0) {
                const updatedEnrollment = await db
                    .update(enrollment)
                    .set({ courseId })
                    .where(eq(enrollment.userId, id))
                    .returning();

                return json({ success: true, message: 'Course updated successfully.', data: updatedEnrollment });
            } else {
                const newEnrollment = await db
                    .insert(enrollment)
                    .values({ userId: id, courseId })
                    .returning();

                return json({ success: true, message: 'Student enrolled in course successfully.', data: newEnrollment });
            }
        } else {
            if (existingEnrollment.length === 0) {
                return json({ success: false, message: 'Student is not enrolled in any course.' }, { status: 400 });
            }

            await db.delete(enrollment).where(eq(enrollment.userId, id));
            return json({ success: true, message: 'Student unenrolled successfully.' });
        }
    } catch (error: any) {
        console.error('Error updating enrollment:', error);
        return json({ success: false, message: 'Internal server error.', error: error.message }, { status: 500 });
    }
};
// export const DELETE: RequestHandler = async ({ request }) => {
//     const authHeader = request.headers.get('authorization');
    
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return json({ success: false, message: 'Unauthorized. No token provided.' }, { status: 401 });
//     }
    
//     const token = authHeader.split(' ')[1];
        
//     if (blacklist.has(token)) {
//         return json({ success: false, message: 'Token has been revoked.' }, { status: 401 });
//     }

//     try {
//         const { id } = await request.json();

//         if (!id) {
//             return json({ success: false, message: 'ID is required.' });
//         }

//         const existingStudent = await db.select().from(user).where(eq(user.id, id));

//         if (existingStudent.length === 0) {
//             return json({ success: false, message: 'ID does not exist.' });
//         }

//         const deletedStudent = await db
//             .delete(user)
//             .where(eq(user.id, id))
//             .returning();

//         console.log(deletedStudent);   
//         return json({ success: true, message: 'Student deleted Successfully.' });
//     } catch (error) {
//         console.error('Error deleting student:', error);
//         return json({ success: false, message: 'Error deleting student.' });
//     }
// };