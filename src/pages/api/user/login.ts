import { NextApiRequest, NextApiResponse } from 'next';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from 'src/models/user';
// utils
import cors from 'src/utils/cors';
import db from 'src/utils/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = '7d';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    db.connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      db.disconnectDB();
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      db.disconnectDB();
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const accessToken = sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    db.disconnectDB();

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        status: "authenticated",
      },
    });
  } catch (error) {
    console.error('[Login API Error]:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
