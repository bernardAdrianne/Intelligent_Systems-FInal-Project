import { json } from '@sveltejs/kit';
import { blacklist } from '$lib/server/db/blacklist';
import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';


export const POST: RequestHandler = async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return json({ success: false, message: 'No token provided.' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.decode(token) as jwt.JwtPayload;

        if (!decoded || !decoded.exp) {
            return json({ succes: false, message: 'Invalid token.' }, { status: 400 });
        }
        blacklist.add(token);
        
		return json({ success: true, message: 'Logged out successfully.' });
    } catch (error) {
        console.error('Logout error:', error);
        return json({ success: false, message: 'Logout failed.' }, { status: 500 });
    }
};
