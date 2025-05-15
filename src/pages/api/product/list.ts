import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import db from 'src/utils/db';
import Product from 'src/models/product';
import Category from 'src/models/category';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);
    await db.connectDB();

    const products = await Product.find()
      .populate({ path: 'category', model: Category })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.error('[Product API]: ', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
