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
    db.connectDB();


    const product = await Product.findById(req.query.id); 
    db.disconnectDB();
    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error('[Product API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
