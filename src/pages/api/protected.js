// src/pages/api/protected.js
import { verifyIdToken } from '../../middleware/auth';

export default async function handler(req, res) {
  await verifyIdToken(req, res, async () => {
    // Your protected route logic here
    res.status(200).json({ message: 'Protected data' });
  });
}
