import { db } from '$lib/server/db';
import { user, enrollment } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';


import bcrypt from 'bcrypt';
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

        const userProfile = await db
            .select()
            .from(user)
            .where(eq(user.id, decoded.id));

        if (userProfile.length === 0) {
            return json({ success: false, message: 'User not found.' }, { status: 404 });
        }

        return json({ success: true, data: userProfile[0] }, { status: 200 });

    } catch (error: any) {
        console.error('Profile fetching error:', error);
        return json({ success: false, message: 'Internal server error.', error: error.message }, { status: 500 });
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
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
        const { name, password, pfp } = await request.json();

        const updateData: { name?: string; password?: string; pfp?: string } = {};

        if (name) updateData.name = name;
		if (pfp) updateData.pfp = pfp;

		if (password) {
            // Password strength validation regex
            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            if (!passRegex.test(password)) {
                return json({ success: false, message: 'Password must be at least 8 characters long and include uppercase, lowercase, and a number.' });
            }
			const hash = await bcrypt.hash(password, 10);
			updateData.password = hash;
		}

        if (Object.keys(updateData).length === 0) {
			return json({ success: false, message: 'No fields provided to update.' }, { status: 400 });
		}
        

        const updatedUser = await db
            .update(user)
            .set(updateData)
            .where(eq(user.id, decoded.id))
            .returning();
        
        return json({ success: true, message: 'Profile Updated successfully.', data: updatedUser });
    } catch (error: any) {
        console.error('Update profile error:', error);
        return json({ success: false, message: 'Internal server error.', error: error.message }, { status: 500 });
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
		const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };

		const existingUser = await db.select().from(user).where(eq(user.id, decoded.id));
		if (existingUser.length === 0) {
			return json({ success: false, message: 'User not found.' }, { status: 404 });
		}

		await db
        .delete(enrollment)
        .where(eq(enrollment.userId, decoded.id));

		await db
        .delete(user)
        .where(eq(user.id, decoded.id)).returning();

		return json({ success: true, message: 'Account deleted successfully.' });
	} catch (error: any) {
		console.error('Delete account error:', error);
		return json({ success: false, message: 'Internal server error.', error: error.message }, { status: 500 });
	}
};
