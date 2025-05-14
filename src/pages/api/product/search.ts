import { NextApiRequest, NextApiResponse } from 'next';

// utils
import cors from 'src/utils/cors';
import db from 'src/utils/db';
import Product from 'src/models/product';
// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name } = req.query;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing product name' });
    }

    await db.connectDB();

    // Tìm các sản phẩm có tên chứa từ khóa (không phân biệt hoa thường)
    const products = await Product.find({
      name: { $regex: name, $options: 'i' },
    });

    await db.disconnectDB();

    return res.status(200).json({ products });
  } catch (error) {
    console.error('[Search Product API]: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
