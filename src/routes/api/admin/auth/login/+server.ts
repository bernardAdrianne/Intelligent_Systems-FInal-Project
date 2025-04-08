import { db } from '$lib/server/db';
import { admin } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { json } from '@sveltejs/kit'; 
import type { RequestHandler } from '@sveltejs/kit';

const JWT = process.env.JWT_SECRET;

if (!JWT) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return json({ sucess: false, message: "All fields are required." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return json({ success: false, message: "INvalid email format." });
        }

        const existingAdmin = await db
            .select()
            .from(admin)
            .where(eq(admin.email, email));
        
        if (existingAdmin.length === 0) {
            return json({ success: false, message: "Admin not found." });
        } 

        const matchedAdmin = existingAdmin[0];

        const isPasswordValid = await bcrypt.compare(password, matchedAdmin.password);
        if (!isPasswordValid) {
            return json({ success: false, messgae: "Incorrect password." });
        }

        const token = jwt.sign(
            { id: matchedAdmin.id, email: matchedAdmin.email },
             JWT, 
            { expiresIn: '12h'}
        );

        return json({ success: true, message: "Login sucessfully.", token });
    } catch (error) {
        console.error("Error logging in as admin:", error);
        return json({ success: false, message: "Error logging inas admin." });
    }
};