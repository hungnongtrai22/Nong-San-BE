import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import db from 'src/utils/db';
import User from 'src/models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    await cors(req, res);

    if (req.method !== 'GET') {
      res.status(405).json({ message: 'Method not allowed' });
      return;
    }

    const { authorization } = req.headers;

    if (!authorization) {
      res.status(401).json({ message: 'Authorization token missing' });
      return;
    }

    const accessToken = `${authorization}`.split(' ')[1];

    let decodedToken: any;

    try {
      decodedToken = verify(accessToken, JWT_SECRET);
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    const userId = decodedToken?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Invalid token payload' });
      return;
    }

    await db.connectDB();

    const user = await User.findById(userId).select('-password');

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }


    return res.status(200).json({ user });
  } catch (error) {
    console.error('[Me API Error]:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
