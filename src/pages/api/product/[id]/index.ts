import { NextApiRequest, NextApiResponse } from 'next';
import Product from 'src/models/product';
// utils
import cors from 'src/utils/cors';
// _mock
import db from 'src/utils/db';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);
    await db.connectDB();


    const product = await Product.findById(req.query.id); 
    return res.status(200).json({
      product,
    });
  } catch (error) {
    console.error('[Product API]: ', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
