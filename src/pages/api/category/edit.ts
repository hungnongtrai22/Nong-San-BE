import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
import slugify from 'slugify';

// _mock
import db from '../../../utils/db';
import Category from 'src/models/category';
// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    if (req.method !== 'PUT') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    db.connectDB();

    const {
      _id,
      name,
    } = req.body;

    if (!_id) {
      db.disconnectDB();
      return res.status(400).json({ message: 'Missing category ID (_id)' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      {
        name,
        slug: slugify(name)
      },
      { new: true }
    );

    db.disconnectDB();

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    return res.status(200).json({
      category: updatedCategory,
    });
  } catch (error) {
    console.error('[Update Intern API]: ', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
