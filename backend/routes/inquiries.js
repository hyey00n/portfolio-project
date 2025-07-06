const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const { db } = require('../config/database');
const { ResponseHelper, Utils } = require('../utils/helpers');

// 첨부파일 업로드 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/inquiries';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, `${basename}_${timestamp}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB 제한
    },
    fileFilter: function (req, file, cb) {
        // 허용할 파일 형식
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('허용되지 않는 파일 형식입니다.'));
        }
    }
});

// 문의하기 등록
router.post('/', upload.single('attachment'), async (req, res) => {
    try {
        const { inquiry_type, name, email, title, content, privacy_agreed } = req.body;

        // 필수 필드 검증
        if (!inquiry_type || !name || !email || !title || !content) {
            return ResponseHelper.sendError(res, 400, '필수 정보가 누락되었습니다.');
        }

        // 개인정보 동의 확인
        if (!privacy_agreed || privacy_agreed !== 'true') {
            return ResponseHelper.sendError(res, 400, '개인정보 처리방침에 동의해야 합니다.');
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return ResponseHelper.sendError(res, 400, '올바른 이메일 형식이 아닙니다.');
        }

        // 첨부파일 정보
        let attachmentFilename = null;
        if (req.file) {
            attachmentFilename = req.file.filename;
        }

        // DB에 저장
        const query = `
            INSERT INTO inquiries (inquiry_type, name, email, title, content, attachment_filename, privacy_agreed, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 1, NOW())
        `;

        const [result] = await db.query(query, [
            inquiry_type,
            Utils.sanitizeInput(name),
            Utils.sanitizeInput(email),
            Utils.sanitizeInput(title),
            Utils.sanitizeInput(content),
            attachmentFilename
        ]);

        const newInquiry = {
            id: result.insertId,
            inquiry_type,
            name: Utils.sanitizeInput(name),
            email: Utils.sanitizeInput(email),
            title: Utils.sanitizeInput(title),
            content: Utils.sanitizeInput(content),
            attachment_filename: attachmentFilename,
            created_at: new Date().toISOString()
        };

        console.log(`새 문의 등록: ${result.insertId} - ${name}`);

        res.status(201);
        ResponseHelper.sendSuccess(res, newInquiry, '문의가 성공적으로 등록되었습니다.');

    } catch (error) {
        console.error('문의 등록 오류:', error);

        // 파일 업로드 에러 처리
        if (error.code === 'LIMIT_FILE_SIZE') {
            return ResponseHelper.sendError(res, 400, '파일 크기는 10MB를 초과할 수 없습니다.');
        }

        if (error.message === '허용되지 않는 파일 형식입니다.') {
            return ResponseHelper.sendError(res, 400, error.message);
        }

        ResponseHelper.sendError(res, 500, '문의 등록에 실패했습니다.', error);
    }
});

// 문의 목록 조회 (관리자용)
router.get('/', async (req, res) => {
    try {
        const { inquiry_type, limit = 50, offset = 0 } = req.query;

        let query = 'SELECT * FROM inquiries';
        let params = [];

        if (inquiry_type) {
            query += ' WHERE inquiry_type = ?';
            params.push(inquiry_type);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [results] = await db.query(query, params);

        const inquiries = results.map(inquiry => ({
            ...inquiry,
            name: Utils.sanitizeInput(inquiry.name),
            email: Utils.sanitizeInput(inquiry.email),
            title: Utils.sanitizeInput(inquiry.title),
            content: Utils.sanitizeInput(inquiry.content)
        }));

        ResponseHelper.sendSuccess(res, inquiries, `${results.length}개의 문의를 조회했습니다.`);

    } catch (error) {
        console.error('문의 목록 조회 오류:', error);
        ResponseHelper.sendError(res, 500, '문의 목록을 불러오는데 실패했습니다.', error);
    }
});

// 특정 문의 조회
router.get('/:id', async (req, res) => {
    try {
        const inquiryId = req.params.id;

        const query = 'SELECT * FROM inquiries WHERE id = ?';
        const [results] = await db.query(query, [inquiryId]);

        if (results.length === 0) {
            return ResponseHelper.sendError(res, 404, '문의를 찾을 수 없습니다.');
        }

        const inquiry = {
            ...results[0],
            name: Utils.sanitizeInput(results[0].name),
            email: Utils.sanitizeInput(results[0].email),
            title: Utils.sanitizeInput(results[0].title),
            content: Utils.sanitizeInput(results[0].content)
        };

        ResponseHelper.sendSuccess(res, inquiry, '문의 조회 성공');

    } catch (error) {
        console.error('문의 조회 오류:', error);
        ResponseHelper.sendError(res, 500, '문의 조회에 실패했습니다.', error);
    }
});

// 문의 통계
router.get('/stats/summary', async (req, res) => {
    try {
        const queries = [
            'SELECT COUNT(*) as count FROM inquiries',
            'SELECT COUNT(*) as count FROM inquiries WHERE DATE(created_at) = CURDATE()',
            'SELECT inquiry_type, COUNT(*) as count FROM inquiries GROUP BY inquiry_type'
        ];

        const results = await Promise.all(
            queries.map(query => db.query(query))
        );

        const stats = {
            totalInquiries: results[0][0][0].count,
            todayInquiries: results[1][0][0].count,
            typeBreakdown: results[2][0]
        };

        ResponseHelper.sendSuccess(res, stats, '문의 통계 조회 성공');

    } catch (error) {
        console.error('문의 통계 오류:', error);
        ResponseHelper.sendError(res, 500, '통계 조회에 실패했습니다.', error);
    }
});

module.exports = router;