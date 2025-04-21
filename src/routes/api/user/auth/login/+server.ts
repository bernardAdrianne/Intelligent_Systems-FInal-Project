import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { json } from '@sveltejs/kit'; 
import type { RequestHandler } from '@sveltejs/kit';

import { JWT_SECRET } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            console.log("Missing email or password");
            return json({ success: false, message: "All fields are required." }, { status: 400 });
        }
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return json({ success: false, message: "Invalid email format." }, { status: 400 });
        }

        // Password strength validation regex
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passRegex.test(password)) {
            return json({ success: false, message: "Password must be at least 8 characters long and include uppercase, lowercase, and a number." }, { status: 400 });
        }
        const existingUser = await db
            .select()
            .from(user)
            .where(eq(user.email, email));

        if (existingUser.length === 0) {
            return json({ success: false, message: "Email not found." }, { status: 404 });
        }

        const matchedUser = existingUser[0];
        const isPasswordValid = await bcrypt.compare(password, matchedUser.password);

        if (!isPasswordValid) {
            return json({ success: false, message: "Incorrect email or password." }, { status: 400 });
        }

        const token = jwt.sign(
            { id: matchedUser.id, email: matchedUser.email },
            JWT_SECRET,
            { expiresIn: '12h' }
        );

        return json({ success: true, message: "Login successfully.", token }, { status: 200 });

    } catch (error: any) {
        console.error("Error logging in as admin:", error.message, error.stack);
        return json({ success: false, message: "Error logging in as admin.", error: error.message }, { status: 500 });
    }
};
