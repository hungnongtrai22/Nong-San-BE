
import { NextApiRequest, NextApiResponse } from 'next';
import slugify from 'slugify';

// utils
import cors from 'src/utils/cors';
// _mock
import Category from 'src/models/category';

import db from '../../../utils/db';
// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { name } = req.body;

    await db.connectDB();

    const test = await Category.findOne({ name });
    if (test) {
      return res.status(400).json({ message: 'Category already exist, Try a different name' });
    }

    const newCategory = await new Category({
      name,
      slug: slugify(name),
    }).save();


    return res.status(200).json({
      category: newCategory,
    });
  } catch (error) {
    console.error('[Auth API]: ', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
