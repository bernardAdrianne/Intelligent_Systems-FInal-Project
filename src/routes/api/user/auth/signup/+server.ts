import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { admin } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import bcrypt from 'bcrypt';

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return json({ success: false, message: 'All fields are required.' }, { status: 400 });
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return json({ success: false, message: 'Invalid email format.' }, { status: 400 });
        }

        // Password strength validation regex
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passRegex.test(password)) {
            return json({ success: false, message: 'Password must be at least 8 characters long and include uppercase, lowercase, and a number.' }, { status: 400 });
        }
        
        const existingUser = await db
            .select()
            .from(user)
            .where(eq(user.email, email));

        if (existingUser.length > 0) {
            return json({ success: false, message: 'An account with this email already exists.' }, { status: 400 });
        }

        const existingAdmin = await db
            .select()
            .from(admin)
            .where(eq(admin.email, email));

        if (existingAdmin.length > 0) {
            return json({ success: false, message: 'An account with this email already exists.' }, { status: 400 });
        }

        const hash = await bcrypt.hash(password, 10);

        await db.insert(user).values({
            name,
            email,
            password: hash,
        });

        return json({ success: true, message: 'Registered successfully.' }, { status: 201 });
    } catch (error) {
        console.error('Error signing up as admin:', error);
        return json({ success: false, message: 'Error signing up as admin.', error }, { status: 500 });
    }
};