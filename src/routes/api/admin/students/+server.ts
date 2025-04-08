import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    try {
        const myStudents = await db.select().from(user);
        
        if (myStudents.length === 0) {
            return json({ success: false, message: "No students found." });
        }

        console.log(myStudents);
        return json({ success: true, data: myStudents });
    } catch (error) {
        console.error("Error fetching students:", error);
        return json({ success: false, message: "Error fetching students." });
    }
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { name, studentid, email, course } = await request.json();

        if (!name || !studentid || !email || !course) {
            return json({ success: false, message: "All fields are required." });
        }

        const newStudent = await db
            .insert(user)
            .values({ name: name,  studentid: studentid, email: email, course: course, })
            .returning();
        
        console.log(newStudent);
        return json({ success: true, message: "New student added successfully.", data: newStudent });
    } catch (error) {
        console.error("Error adding new student:", error);
        return json({ success: false, message: "Error adding new student." });
    }
};

export const PUT: RequestHandler = async ({ request }) => {
    try {
        const { id, name, course } = await request.json();

        if (!id) {
            return json({ success: false, message: "ID is required" });
        }

        const existingStudent = await db.select().from(user).where(eq(user.id, id));

        if (existingStudent.length === 0) {
            return json({ success: false, message: "ID does not exist." });
        }

        const updatedStudent = await db
            .update(user)
            .set({ name, course })
            .where(eq(user.id, id))
            .returning();

        console.log(updatedStudent);
        return json({ success: true, message: "Student Updated successfully.", data: updatedStudent });
    } catch (error) {
        console.error("Error updating student:", error);
        return json({ success: false, message: "Error updating student." });
    }
}

export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const { id } = await request.json();

        if (!id) {
            return json({ success: false, message: "ID is required." });
        }

        const existingStudent = await db.select().from(user).where(eq(user.id, id));

        if (existingStudent.length === 0) {
            return json({ success: false, message: "ID does not exist." });
        }

        const deletedStudent = await db
            .delete(user)
            .where(eq(user.id, id))
            .returning();

        console.log(deletedStudent);   
        return json({ success: true, message: "Student deleted Successfully." });
    } catch (error) {
        console.error("Error deleting student:", error);
        return json({ success: false, message: "Error deleting student." });
    }
};