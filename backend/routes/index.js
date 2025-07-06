const express = require('express');
const router = express.Router();

// 각 라우터 불러오기 (주석 해제)
const commentsRouter = require('./comments');
const portfolioRouter = require('./portfolio');
const faqRouter = require('./faq');
const inquiriesRouter = require('./inquiries');

// 라우터 연결 (주석 해제)
router.use('/comments', commentsRouter);
router.use('/portfolio', portfolioRouter);
router.use('/faq', faqRouter);
router.use('/inquiries', inquiriesRouter);

// Health check와 test는 여기서 직접 처리
// 다른 라우터들 위에 직접 테스트 라우트 추가
router.get('/comments', (req, res) => {
    res.json({
        success: true,
        message: "Direct comments route working!",
        timestamp: new Date().toISOString()
    });
});

router.get('/health', (req, res) => {
    const { ResponseHelper } = require('../utils/helpers');
    const { db } = require('../config/database');

    ResponseHelper.sendSuccess(res, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: db.isConnected ? 'connected' : 'disconnected'
    }, 'API 서버가 정상 작동 중입니다');
});

router.get('/test', (req, res) => {
    const { ResponseHelper } = require('../utils/helpers');

    ResponseHelper.sendSuccess(res, {
        message: 'API 테스트 성공',
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version
    });
});

module.exports = router;