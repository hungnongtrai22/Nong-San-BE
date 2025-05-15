import { NextApiRequest, NextApiResponse } from 'next';
import Category from 'src/models/category';
// utils
import cors from 'src/utils/cors';
// _mock
import db from 'src/utils/db';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);
    await db.connectDB();


    const category = await Category.findById(req.query.id); 
    return res.status(200).json({
      category,
    });
  } catch (error) {
    console.error('[Product API]: ', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
