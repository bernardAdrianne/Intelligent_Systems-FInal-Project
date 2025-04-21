import { db } from '$lib/server/db';
import { user, course, enrollment } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  try {
    const totalStudents = (await db.select().from(user)).length;

    const enrollments = await db
      .select({
        courseId: course.id,
        courseName: course.name,
      })
      .from(enrollment)
      .leftJoin(course, eq(enrollment.courseId, course.id));

    const courseStats: Record<string, number> = {};

    enrollments.forEach((e) => {
      if (!e.courseName) return;
      if (!courseStats[e.courseName]) {
        courseStats[e.courseName] = 0;
      }
      courseStats[e.courseName]++;
    });

    return json({ total: totalStudents, courseStats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
};
