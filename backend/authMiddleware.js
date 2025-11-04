const jwt = require('jsonwebtoken');

// ดึง Secret Key เดียวกับที่ใช้สร้าง Token
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    // 1. ดึง Token จาก Header 'Authorization'
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token not provided or invalid.' });
    }

    const token = authHeader.split(' ')[1]; // แยกคำว่า 'Bearer ' ออกไป

    try {
        // 2. ตรวจสอบและถอดรหัส Token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. แนบข้อมูลผู้ใช้ (จาก Token) เข้าไปใน Request
        req.user = decoded;
        next(); // ไปยังฟังก์ชันถัดไป (ฟังก์ชันหลักของ route)
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;