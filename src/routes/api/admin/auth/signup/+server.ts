import { db } from '$lib/server/db';
import { admin } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import bcrypt from 'bcrypt';

import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';


export const POST: RequestHandler = async ({ request }) => {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return json({ success: false, message: "All fields are required." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return json({ success: false, message: "INvalid email format." });
        }

        const existingAdmin = await db
            .select()
            .from(admin)
            .where(eq(admin.email, email));

        if (existingAdmin.length > 0) {
            return json({ success: false, message: "An account with this email already exists." });
        }

        const hash = await bcrypt.hash(password, 10);

        await db.insert(admin).values({
            name,
            email,
            password: hash,
        });

        return json({ success: true, message: "Registered successfully." });
    } catch (error) {
        console.error("Error signing up as admin:", error);
        return json({ success: false, message: "Error signing up as admin." });
    }
};