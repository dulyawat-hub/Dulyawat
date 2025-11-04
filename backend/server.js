const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const os = require('os');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET is not defined in .env file!');
    process.exit(1);
}

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Connected to MySQL Pool');
        connection.release();
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
    } catch (err) {
        console.error('❌ MySQL Connection Error:', err);
        process.exit(1);
    }
})();

const getIpAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
};

const saveImageFromBase64 = (base64Data, type = 'cat') => {
    if (!base64Data || typeof base64Data !== 'string') {
        throw new Error("Invalid Base64 data provided.");
    }
    const base64Content = base64Data.split(',')[1] || base64Data;
    const imageBuffer = Buffer.from(base64Content, 'base64');
    const filename = `${type}_${Date.now()}.jpeg`;
    const filePath = path.join(__dirname, 'uploads', filename);
    fs.writeFileSync(filePath, imageBuffer);
    const ipAddress = getIpAddress();
    return `http://${ipAddress}:${port}/uploads/${filename}`;
};

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ message: 'ไม่ได้ยืนยันตัวตน (ไม่พบโทเคน)' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'โทเคนไม่ถูกต้อง' });
        }
        req.user = user;
        next();
    });
};

const adminAuthMiddleware = (req, res, next) => {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({ message: 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้' });
    }
    next();
};

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
    }
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];
        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้ด้วยอีเมลนี้', error: 'email' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
            const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'เข้าสู่ระบบสำเร็จ', user, token });
        } else {
            res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง', error: 'password' });
        }
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
    }
});

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [checkUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (checkUser.length > 0) {
            return res.status(400).json({ message: 'อีเมลนี้ถูกใช้ไปแล้ว' });
        }
        const sql = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
        await db.query(sql, [firstName, lastName, email, hashedPassword]);
        res.status(201).json({ message: 'สมัครสมาชิกเรียบร้อยแล้ว' });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
    }
});

app.post('/update-profile', authMiddleware, async (req, res) => {
    const { first_name, last_name, newPassword } = req.body;
    const email = req.user.email;
    if (!first_name || !last_name) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }
    try {
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await db.query('UPDATE users SET first_name = ?, last_name = ?, password = ? WHERE email = ?', [first_name, last_name, hashedPassword, email]);
        } else {
            await db.query('UPDATE users SET first_name = ?, last_name = ? WHERE email = ?', [first_name, last_name, email]);
        }
        res.json({ message: 'อัปเดตข้อมูลโปรไฟล์สำเร็จ' });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
    }
});

app.post('/upload-profile-pic', authMiddleware, async (req, res) => {
    const { imageData } = req.body;
    const email = req.user.email;
    if (!imageData) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }
    try {
        const [oldPic] = await db.query('SELECT profile_pic_url FROM users WHERE email = ?', [email]);
        if (oldPic.length > 0 && oldPic[0].profile_pic_url) {
            const oldFilename = path.basename(oldPic[0].profile_pic_url);
            if (oldFilename !== '149071.png' && fs.existsSync(path.join(__dirname, 'uploads', oldFilename))) {
                fs.unlinkSync(path.join(__dirname, 'uploads', oldFilename));
            }
        }
        const profilePicUrl = saveImageFromBase64(imageData, 'profile');
        await db.query('UPDATE users SET profile_pic_url = ? WHERE email = ?', [profilePicUrl, email]);
        res.json({ message: 'อัปโหลดรูปโปรไฟล์สำเร็จ', profilePicUrl });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' });
    }
});

app.post('/delete-account', authMiddleware, async (req, res) => {
    const { password } = req.body;
    const email = req.user.email;
    if (!password) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }
    try {
        const [user] = await db.query('SELECT password FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้ด้วยอีเมลนี้' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
        }
        const [deletedUser] = await db.query('SELECT profile_pic_url FROM users WHERE email = ?', [email]);
        if (deletedUser.length > 0 && deletedUser[0].profile_pic_url) {
            const oldFilename = path.basename(deletedUser[0].profile_pic_url);
            const oldFilePath = path.join(__dirname, 'uploads', oldFilename);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }
        await db.query('DELETE FROM users WHERE email = ?', [email]);
        res.json({ message: 'ลบบัญชีสำเร็จ' });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
    }
});

app.post('/reset-password-insecure', async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }
    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้ด้วยอีเมลนี้' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
        res.json({ message: 'รีเซ็ตรหัสผ่านสำเร็จ' });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
    }
});

app.get('/api/policies', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM policies');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch policies' });
    }
});

app.get('/api/hotelpolicy', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM hotelpolicy');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch hotel policies' });
    }
});

app.get('/cats/:userId', authMiddleware, async (req, res) => {
    const userId = req.params.userId;
    if (parseInt(userId, 10) !== req.user.id) {
        return res.status(403).json({ message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้' });
    }
    try {
        const [cats] = await db.query('SELECT * FROM cats WHERE user_id = ?', [userId]);
        res.json(cats);
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแมว' });
    }
});

app.post('/cats', authMiddleware, async (req, res) => {
    const { name, breed, doc_img_url } = req.body;
    const user_id = req.user.id;
    if (!name || !doc_img_url) {
        return res.status(400).json({ message: 'กรุณากรอกชื่อและอัปโหลดรูปภาพเอกสาร' });
    }
    try {
        const docImgUrl = saveImageFromBase64(doc_img_url, 'doc');
        const sql = 'INSERT INTO cats (name, breed, doc_img_url, user_id) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [name, breed, docImgUrl, user_id]);
        res.status(201).json({ message: 'เพิ่มแมวสำเร็จ', catId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มแมว' });
    }
});

app.put('/cats/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, breed, doc_img_url } = req.body;
    const user_id = req.user.id;
    try {
        const [cats] = await db.query('SELECT * FROM cats WHERE id = ? AND user_id = ?', [id, user_id]);
        if (cats.length === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลแมว หรือคุณไม่มีสิทธิ์แก้ไข' });
        }
        const existingCat = cats[0];
        let newDocImgUrl = existingCat.doc_img_url;
        if (doc_img_url && doc_img_url.startsWith('data:image')) {
            newDocImgUrl = saveImageFromBase64(doc_img_url, 'doc');
        }
        const sql = 'UPDATE cats SET name = ?, breed = ?, doc_img_url = ? WHERE id = ? AND user_id = ?';
        await db.query(sql, [name || existingCat.name, breed || existingCat.breed, newDocImgUrl, id, user_id]);
        res.json({ message: 'อัปเดตข้อมูลแมวสำเร็จ' });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลแมว' });
    }
});

app.delete('/cats/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        const [cats] = await db.query('SELECT * FROM cats WHERE id = ? AND user_id = ?', [id, user_id]);
        if (cats.length === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลแมว หรือคุณไม่มีสิทธิ์ลบ' });
        }
        const sql = 'DELETE FROM cats WHERE id = ? AND user_id = ?';
        await db.query(sql, [id, user_id]);
        res.json({ message: 'ลบข้อมูลแมวสำเร็จ' });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลแมว' });
    }
});

app.get('/api/rooms', async (req, res) => {
    const { checkInDate, checkOutDate } = req.query;
    if (!checkInDate || !checkOutDate) {
        return res.status(400).json({ message: 'กรุณาระบุวันเช็คอินและเช็คเอาท์' });
    }
    try {
        const sqlQuery = `
            SELECT * FROM rooms
            WHERE id NOT IN (
                SELECT room_id FROM bookings
                WHERE
                    check_in_date < ? 
                    AND check_out_date > ?
                    AND booking_status IN ('Pending', 'Confirmed', 'Checked In')
            )
            ORDER BY id ASC;
        `;
        const [availableRooms] = await db.query(sqlQuery, [checkOutDate, checkInDate]);
        res.json(availableRooms);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch available rooms' });
    }
});

app.get('/api/rooms/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const roomSql = `
            SELECT 
                r.id, r.name, r.price, r.image_url, r.description, r.rating,
                h.name AS hotel_name, h.address AS hotel_address,
                h.email AS hotel_email, h.phone AS hotel_phone
            FROM rooms r
            LEFT JOIN hotels h ON r.hotel_id = h.id
            WHERE r.id = ?;
        `;
        const [roomResults] = await db.query(roomSql, [id]);
        if (roomResults.length === 0) {
            return res.status(404).json({ message: 'ไม่พบห้องพักนี้' });
        }
        const roomData = roomResults[0];
        const amenitiesSql = `
            SELECT a.name FROM amenities a
            JOIN room_amenities ra ON a.id = ra.amenity_id
            WHERE ra.room_id = ?;
        `;
        const [amenitiesResults] = await db.query(amenitiesSql, [id]);
        const amenities = amenitiesResults.map(item => item.name);
        const reviewsSql = 'SELECT id, username, rating, comment FROM reviews WHERE room_id = ? ORDER BY id DESC;';
        const [reviews] = await db.query(reviewsSql, [id]);
        const finalJsonResponse = {
            id: roomData.id,
            name: roomData.name,
            price: roomData.price,
            image_url: roomData.image_url,
            description: roomData.description,
            rating: roomData.rating,
            hotel: {
                name: roomData.hotel_name,
                address: roomData.hotel_address,
                email: roomData.hotel_email,
                phone: roomData.hotel_phone
            },
            amenities: amenities,
            reviews: reviews
        };
        res.json(finalJsonResponse);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch room details' });
    }
});

// app.post('/api/bookings', authMiddleware, async (req, res) => {
//     // ✅ 1. รับ total_price และ deposit_amount
//     const { room_id, check_in_date, check_out_date, cat_count, total_price, deposit_amount } = req.body;
//     const user_id = req.user.id;

//     if (!room_id || !check_in_date || !check_out_date || !cat_count || total_price === undefined || deposit_amount === undefined) {
//         return res.status(400).json({ message: 'ข้อมูลที่ส่งมาไม่ครบถ้วน' });
//     }
//     try {
//         const checkExistingSql = `SELECT id FROM bookings WHERE user_id = ? AND booking_status IN ('Pending', 'Confirmed')`;
//         const [existingBookings] = await db.query(checkExistingSql, [user_id]);
//         if (existingBookings.length > 0) {
//             return res.status(409).json({ message: 'คุณมีรายการจองที่ยังดำเนินการไม่เสร็จสิ้นอยู่แล้ว' });
//         }

//         const payment_deadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
//         // ✅ 2. เพิ่ม total_price และ deposit_amount เข้าไปในคำสั่ง INSERT
//         const insertSql = `
//             INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, cat_count, total_price, deposit_amount, payment_deadline, booking_status) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed');
//         `;
//         const [result] = await db.query(insertSql, [user_id, room_id, check_in_date, check_out_date, cat_count, total_price, deposit_amount, payment_deadline]);
        
//         res.status(201).json({ 
//             message: 'สร้างรายการจองสำเร็จ กรุณาชำระเงินภายใน 24 ชั่วโมง', 
//             bookingId: result.insertId,
//             paymentDeadline: payment_deadline.toISOString(),
//         });
//     } catch (err) {
//         console.error('❌ Error creating booking:', err);
//         res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลการจอง' });
//     }
// });

app.post('/api/bookings', authMiddleware, async (req, res) => {
    const { room_id, check_in_date, check_out_date, cat_count, total_price, deposit_amount } = req.body;
    const user_id = req.user.id;

    if (!room_id || !check_in_date || !check_out_date || !cat_count || total_price === undefined || deposit_amount === undefined) {
        return res.status(400).json({ message: 'ข้อมูลที่ส่งมาไม่ครบถ้วน' });
    }
    try {
        // Check if user already has a pending or confirmed booking
        const checkExistingSql = `SELECT id FROM bookings WHERE user_id = ? AND booking_status IN ('Pending', 'Confirmed')`;
        const [existingBookings] = await db.query(checkExistingSql, [user_id]);
        if (existingBookings.length > 0) {
            return res.status(409).json({ message: 'คุณมีรายการจองที่ยังดำเนินการไม่เสร็จสิ้นอยู่แล้ว' });
        }

        // Set payment deadline for 24 hours from now
        const payment_deadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        // SQL to insert new booking with 'Pending' status
        const insertSql = `
            INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, cat_count, total_price, deposit_amount, payment_deadline, booking_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending');
        `;
        const [result] = await db.query(insertSql, [user_id, room_id, check_in_date, check_out_date, cat_count, total_price, deposit_amount, payment_deadline]);
        
        res.status(201).json({ 
            message: 'สร้างรายการจองสำเร็จ กรุณาชำระเงินภายใน 24 ชั่วโมง', 
            bookingId: result.insertId,
            paymentDeadline: payment_deadline.toISOString(),
        });
    } catch (err) {
        console.error('❌ Error creating booking:', err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลการจอง' });
    }
});

app.get('/api/bookings/:userId', authMiddleware, async (req, res) => {
    const requestedUserId = parseInt(req.params.userId, 10);
    const tokenUserId = req.user.id;
    if (requestedUserId !== tokenUserId) {
        return res.status(403).json({ message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้' });
    }
    try {
        const sql = `
            SELECT 
                b.id, b.room_id, b.check_in_date, b.check_out_date,
                b.booking_status, b.payment_status, b.is_reviewed, b.payment_deadline,
                b.total_price, b.deposit_amount, -- ✅ เพิ่ม 2 คอลัมน์นี้
                r.name AS room_name, r.image_url AS room_image, r.price AS room_price,
                rev.rating AS user_rating,
                rev.comment AS user_comment
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            LEFT JOIN reviews rev ON b.id = rev.booking_id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC;
        `;
        const [bookings] = await db.query(sql, [requestedUserId]);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง' });
    }
});

// ✅✅✅ START: โค้ดที่เพิ่ม/แก้ไข ✅✅✅
// API for user to cancel their own booking
// ใน server.js ให้แทนที่ของเก่าด้วยโค้ดนี้

app.patch('/api/bookings/:bookingId/cancel', authMiddleware, async (req, res) => {
    const { bookingId } = req.params;
    const user_id = req.user.id;
    
    // ✅ 1. แก้ไขชื่อ Key ให้ตรงกับที่แอปส่งมา
    const { 
        cancellation_reason, 
        refund_bank_name, 
        refund_account_number, 
        refund_account_name 
    } = req.body;

    // ✅ 2. อัปเดตเงื่อนไขการเช็คข้อมูลให้ใช้ชื่อ Key ที่ถูกต้อง
    if (!cancellation_reason || !refund_bank_name || !refund_account_number || !refund_account_name) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลการยกเลิกให้ครบถ้วน' });
    }

    try {
        const sql = `
            UPDATE bookings 
            SET 
                booking_status = 'Cancelled',
                cancellation_reason = ?,
                refund_bank_name = ?,
                refund_account_number = ?,
                refund_account_name = ?
            WHERE id = ? AND user_id = ? AND booking_status IN ('Pending', 'Confirmed');
        `;
        
        // ✅ 3. ส่งตัวแปรที่ถูกต้องเข้าไปใน query
        const [result] = await db.query(sql, [
            cancellation_reason, 
            refund_bank_name, 
            refund_account_number, 
            refund_account_name, 
            bookingId, 
            user_id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบรายการจองที่สามารถยกเลิกได้ หรืออาจถูกยกเลิกไปแล้ว' });
        }

        res.json({ message: 'ส่งคำขอยกเลิกการจองเรียบร้อยแล้ว' });

    } catch (err) {
        console.error('Error cancelling booking:', err);
        // เพิ่มรายละเอียดของ Error เพื่อให้ดีบักง่ายขึ้น
        res.status(500).json({ message: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์', error: err.message });
    }
});

// ✅ ให้เพิ่มโค้ดสำหรับยืนยันการคืนเงินไว้ตรงนี้
// app.patch('/api/admin/bookings/:id/refund', (req, res) => { // อาจจะต้องมี middleware ตรวจสอบ token ของ admin ด้วย
//     const { id } = req.params; // ID ของ booking ที่ส่งมาจากหน้าแอป

//     try {
//         // ตรวจสอบให้แน่ใจว่าตัวแปรที่ใช้เชื่อมต่อฐานข้อมูลของคุณชื่ออะไร
//         // ในตัวอย่างนี้ผมสมมติว่าชื่อ 'db'
//         const updateQuery = "UPDATE bookings SET booking_status = 'Refunded' WHERE id = ? AND booking_status = 'Cancelled'";
        
//         db.query(updateQuery, [id], (err, result) => {
//             if (err) {
//                 console.error('Database error on refund:', err);
//                 return res.status(500).json({ message: 'เกิดข้อผิดพลาดในฐานข้อมูล' });
//             }

//             // ตรวจสอบว่ามีการอัปเดตข้อมูลจริงหรือไม่
//             if (result.affectedRows === 0) {
//                 return res.status(404).json({ message: 'ไม่พบรายการจองที่ถูกยกเลิก หรืออาจถูกดำเนินการไปแล้ว' });
//             }

//             res.status(200).json({ message: 'ยืนยันการคืนเงินเรียบร้อยแล้ว' });
//         });

//     } catch (error) {
//         console.error('Server error on refund:', error);
//         res.status(500).json({ message: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' });
//     }
// });

app.patch('/api/admin/bookings/:id/refund', (req, res) => {
    const { id } = req.params;

    console.log(`[DEBUG] ได้รับคำขอยืนยันคืนเงิน ID: ${id}. กำลังจะส่งคำตอบกลับทันที...`);

    // ----------------------------------------------------
    //  ✅ ส่งคำตอบกลับไปหาแอป "ทันที" โดยไม่รอฐานข้อมูล
    // ----------------------------------------------------
    res.status(200).json({ message: 'ได้รับคำขอแล้ว กำลังดำเนินการ' });


    // --- แล้วค่อยไปทำงานกับฐานข้อมูลทีหลังแบบเงียบๆ ---
    try {
        const updateQuery = "UPDATE bookings SET booking_status = 'Refunded' WHERE id = ? AND booking_status = 'Cancelled'";
        
        // ตรวจสอบให้แน่ใจว่าตัวแปร connection ของคุณชื่อ 'db'
        db.query(updateQuery, [id], (err, result) => {
            if (err) {
                // แค่ log error ไว้ดู แต่ไม่ต้องส่ง res อะไรกลับไปอีกแล้ว
                console.error(`[DEBUG] เกิดข้อผิดพลาดกับฐานข้อมูล (หลังจากส่งคำตอบแล้ว):`, err);
                return; 
            }
            if (result.affectedRows > 0) {
                console.log(`[DEBUG] อัปเดตฐานข้อมูล ID: ${id} สำเร็จ (หลังจากส่งคำตอบแล้ว).`);
            } else {
                console.log(`[DEBUG] ไม่พบข้อมูล ID: ${id} ให้อัปเดต (หลังจากส่งคำตอบแล้ว).`);
            }
        });
    } catch (e) {
        console.error(`[DEBUG] เกิดข้อผิดพลาดในโค้ดเซิร์ฟเวอร์ (หลังจากส่งคำตอบแล้ว):`, e);
    }
});

app.post('/api/bookings/:bookingId/upload-slip', authMiddleware, async (req, res) => {
    const { bookingId } = req.params;
    const { slip_image_data } = req.body;
    const user_id = req.user.id;
    if (!slip_image_data) {
        return res.status(400).json({ message: 'ไม่พบข้อมูลสลิป' });
    }
    try {
        const slipUrl = saveImageFromBase64(slip_image_data, 'slip');
        const sql = `
            UPDATE bookings 
            SET payment_slip_url = ?, payment_status = 'Paid' 
            WHERE id = ? AND user_id = ?;
        `;
        await db.query(sql, [slipUrl, bookingId, user_id]);
        res.json({ message: 'อัปโหลดสลิปและยืนยันการชำระเงินเรียบร้อยแล้ว' });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปโหลดสลิป' });
    }
});

app.post('/api/reviews', authMiddleware, async (req, res) => {
    const { booking_id, room_id, rating, comment } = req.body;
    const [userData] = await db.query('SELECT first_name, last_name FROM users WHERE id = ?', [req.user.id]);
    const username = `${userData[0].first_name} ${userData[0].last_name}`;
    if (!booking_id || !room_id || !rating || !comment) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลรีวิวให้ครบถ้วน' });
    }
    const connection = await db.getConnection(); 
    try {
        await connection.beginTransaction();
        const reviewSql = 'INSERT INTO reviews (booking_id, room_id, username, rating, comment) VALUES (?, ?, ?, ?, ?)';
        await connection.query(reviewSql, [booking_id, room_id, username, rating, comment]);
        const updateRatingSql = `
            UPDATE rooms
            SET rating = (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE room_id = ?)
            WHERE id = ?;
        `;
        await connection.query(updateRatingSql, [room_id, room_id]);
        const updateBookingSql = 'UPDATE bookings SET is_reviewed = 1 WHERE id = ?';
        await connection.query(updateBookingSql, [booking_id]);
        await connection.commit();
        res.status(201).json({ message: 'ขอบคุณสำหรับรีวิวของคุณ!' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการส่งรีวิว' });
    } finally {
        connection.release();
    }
});

// --- Admin Routes ---
// ใน server.js ให้แทนที่ของเก่าด้วยโค้ดนี้

app.get('/api/admin/bookings', authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const sql = `
            SELECT 
                b.id, 
                b.check_in_date, 
                b.check_out_date, 
                b.booking_status, 
                b.payment_status,
                b.payment_slip_url, 
                
                -- ✅ เพิ่มคอลัมน์ 4 บรรทัดนี้เข้ามาให้ครบ --
                b.cancellation_reason,
                b.refund_bank_name,
                b.refund_account_number,
                b.refund_account_name,
                
                u.first_name, 
                u.last_name, 
                r.name as room_name,
                r.price as room_price -- 🔴 ลบเครื่องหมาย , ที่เกินออกไปจากตรงนี้
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN rooms r ON b.room_id = r.id
            ORDER BY b.created_at DESC;
        `;
        const [bookings] = await db.query(sql);
        res.json(bookings);
    } catch(err) {
        console.error("Error fetching admin bookings:", err);
        res.status(500).json({ message: "Failed to fetch bookings for admin" });
    }
});
// ✅✅✅ END: EDITED SECTION ✅✅✅

app.put('/api/admin/bookings/:bookingId', authMiddleware, adminAuthMiddleware, async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body; 
    if (!['Pending', 'Confirmed', 'Cancelled', 'Checked In', 'Checked Out', 'Completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }
    try {
        const sql = "UPDATE bookings SET booking_status = ? WHERE id = ?";
        await db.query(sql, [status, bookingId]);
        res.json({ message: `Booking ${bookingId} has been updated to ${status}.` });
    } catch(err) {
        console.error("Error updating booking status:", err);
        res.status(500).json({ message: "Failed to update booking status" });
    }
});

app.get('/api/amenities', authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const [amenities] = await db.query('SELECT * FROM amenities ORDER BY id ASC');
        res.json(amenities);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch amenities' });
    }
});

app.post('/api/admin/rooms', authMiddleware, adminAuthMiddleware, async (req, res) => {
    const { name, description, price, image_url, amenities_ids } = req.body;
    if (!name || !price || !image_url) {
        return res.status(400).json({ message: 'กรุณากรอกชื่อ, ราคา, และอัปโหลดรูปภาพ' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const finalImageUrl = saveImageFromBase64(image_url, 'room');
        const roomSql = 'INSERT INTO rooms (name, description, price, image_url, hotel_id) VALUES (?, ?, ?, ?, ?)';
        const [result] = await connection.query(roomSql, [name, description, price, finalImageUrl, 1]);
        const newRoomId = result.insertId;
        if (amenities_ids && amenities_ids.length > 0) {
            const amenitiesValues = amenities_ids.map(amenityId => [newRoomId, amenityId]);
            await connection.query('INSERT INTO room_amenities (room_id, amenity_id) VALUES ?', [amenitiesValues]);
        }
        await connection.commit();
        res.status(201).json({ message: 'เพิ่มห้องพักสำเร็จ', roomId: newRoomId });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มห้องพัก' });
    } finally {
        connection.release();
    }
});

app.put('/api/admin/rooms/:id', authMiddleware, adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image_url, amenities_ids } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        let finalImageUrl = image_url;
        if (image_url && image_url.startsWith('data:image')) {
            finalImageUrl = saveImageFromBase64(image_url, 'room');
        }
        const roomSql = 'UPDATE rooms SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?';
        await connection.query(roomSql, [name, description, price, finalImageUrl, id]);
        await connection.query('DELETE FROM room_amenities WHERE room_id = ?', [id]);
        if (amenities_ids && amenities_ids.length > 0) {
            const amenitiesValues = amenities_ids.map(amenityId => [id, amenityId]);
            await connection.query('INSERT INTO room_amenities (room_id, amenity_id) VALUES ?', [amenitiesValues]);
        }
        await connection.commit();
        res.json({ message: 'อัปเดตข้อมูลห้องพักสำเร็จ' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตห้องพัก' });
    } finally {
        connection.release();
    }
});

app.delete('/api/admin/rooms/:id', authMiddleware, adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM rooms WHERE id = ?', [id]);
        res.json({ message: 'ลบห้องพักสำเร็จ' });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบห้องพัก' });
    }
});

app.post('/api/admin/amenities', authMiddleware, adminAuthMiddleware, async (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({ message: 'กรุณาระบุชื่อสิ่งอำนวยความสะดวก' });
    }
    try {
        const [existing] = await db.query('SELECT id FROM amenities WHERE name = ?', [name.trim()]);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'มีสิ่งอำนวยความสะดวกชื่อนี้อยู่แล้ว' });
        }
        const sql = 'INSERT INTO amenities (name) VALUES (?)';
        const [result] = await db.query(sql, [name.trim()]);
        res.status(201).json({ 
            message: 'เพิ่มสิ่งอำนวยความสะดวกสำเร็จ', 
            newAmenity: { id: result.insertId, name: name.trim() } 
        });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล' });
    }
});

// app.get('/api/admin/bookings', authMiddleware, adminAuthMiddleware, async (req, res) => {
//     try {
//         const sql = `
//             SELECT 
//                 b.id, b.check_in_date, b.check_out_date, b.booking_status, b.payment_status,
//                 b.payment_slip_url, 
//                 u.first_name, u.last_name,
//                 r.name as room_name,
//                 r.price as room_price,
//             FROM bookings b
//             JOIN users u ON b.user_id = u.id
//             JOIN rooms r ON b.room_id = r.id
//             ORDER BY b.created_at DESC;
//         `;
//         const [bookings] = await db.query(sql);
//         res.json(bookings);
//     } catch(err) {
//         console.error("Error fetching admin bookings:", err);
//         res.status(500).json({ message: "Failed to fetch bookings for admin" });
//     }
// });

// ในไฟล์ server.js (วางทับของเก่าไปเลย)

app.get('/api/admin/bookings', authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const sql = `
            SELECT 
                b.id, 
                b.check_in_date, 
                b.check_out_date, 
                b.booking_status, 
                b.payment_status,
                b.payment_slip_url, 
                
                -- ✅ นี่คือส่วนสำคัญที่ต้องเพิ่มเข้าไป --
                b.cancellation_reason,
                b.refund_bank_name,
                b.refund_account_number,
                b.refund_account_name,
                
                u.first_name, 
                u.last_name,
                r.name as room_name,
                r.price as room_price
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN rooms r ON b.room_id = r.id
            ORDER BY b.created_at DESC;
        `;
        const [bookings] = await db.query(sql);
        res.json(bookings);
    } catch(err) {
        console.error("Error fetching admin bookings:", err);
        res.status(500).json({ message: "Failed to fetch bookings for admin" });
    }
});

app.put('/api/admin/bookings/:bookingId', authMiddleware, adminAuthMiddleware, async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body; 
    if (!['Pending', 'Confirmed', 'Cancelled', 'Checked In', 'Checked Out', 'Completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }
    try {
        const sql = "UPDATE bookings SET booking_status = ? WHERE id = ?";
        await db.query(sql, [status, bookingId]);
        res.json({ message: `Booking ${bookingId} has been updated to ${status}.` });
    } catch(err) {
        res.status(500).json({ message: "Failed to update booking status" });
    }
});

app.get('/api/admin/stay-history', authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const sql = `
            SELECT 
                b.id,
                b.check_in_date,
                b.check_out_date,
                u.first_name,
                u.last_name,
                r.name AS room_name
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN rooms r ON b.room_id = r.id
            WHERE b.booking_status IN ('Completed', 'Checked Out')
            ORDER BY b.check_in_date DESC;
        `;
        const [history] = await db.query(sql);
        res.json(history);
    } catch(err) {
        console.error("Error fetching stay history:", err);
        res.status(500).json({ message: "Failed to fetch stay history for admin" });
    }
});

// GET all non-admin users
app.get('/api/admin/users', authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const sql = `
            SELECT id, first_name, last_name, email, profile_pic_url, created_at 
            FROM users 
            WHERE is_admin = 0 
            ORDER BY created_at DESC;
        `;
        const [users] = await db.query(sql);
        res.json(users);
    } catch(err) {
        console.error("Error fetching users for admin:", err);
        res.status(500).json({ message: "Failed to fetch users for admin" });
    }
});

// DELETE a user
app.delete('/api/admin/users/:id', authMiddleware, adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        // ป้องกันไม่ให้แอดมินลบตัวเองหรือแอดมินคนอื่นโดยไม่ตั้งใจ
        const [result] = await db.query('DELETE FROM users WHERE id = ? AND is_admin = 0', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้ หรือไม่สามารถลบบัญชีแอดมินได้' });
        }
        
        res.json({ message: 'ลบบัญชีผู้ใช้สำเร็จ' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบบัญชี' });
    }
});

app.get('/api/admin/rooms', authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const [allRooms] = await db.query('SELECT * FROM rooms ORDER BY id ASC');
        
        // ค้นหาห้องที่มีการจองอยู่ในปัจจุบัน (วันนี้อยู่ในช่วง check_in และ check_out)
        const today = new Date();
        
        const [bookedRoomsResult] = await db.query(`
            SELECT DISTINCT room_id 
            FROM bookings 
            WHERE ? >= check_in_date AND ? < check_out_date AND booking_status IN ('Confirmed', 'Checked In')
        `, [today, today]);
        
        const bookedRoomIds = new Set(bookedRoomsResult.map(b => b.room_id));

        const roomsWithStatus = allRooms.map(room => ({
            ...room,
            // เพิ่ม key 'status' เข้าไปใน object ของแต่ละห้อง
            status: bookedRoomIds.has(room.id) ? 'ไม่ว่าง' : 'ว่าง'
        }));

        res.json(roomsWithStatus);
    } catch(err) {
        console.error("Error fetching rooms for admin:", err);
        res.status(500).json({ message: "Failed to fetch rooms for admin" });
    }
});


// --- Static File Serving & Server Start ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`🚀 Server running at http://${getIpAddress()}:${port}`);
});