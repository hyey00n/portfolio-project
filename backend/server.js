const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const { db } = require('./config/database');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// ====================
// SECURITY MIDDLEWARE
// ====================

// Basic security headers
app.use(helmet({
    contentSecurityPolicy: false  // 개발 중에는 CSP 비활성화
}));

// ====================
// BASIC MIDDLEWARE
// ====================

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
        : true,
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress;

    console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${ip} - UA: ${userAgent.substring(0, 50)}`);
    next();
});

// ====================
// ROUTES
// ====================

// 기본 테스트 라우트
app.get('/test', (req, res) => {
    res.json({
        message: 'Server working!',
        timestamp: new Date().toISOString(),
        status: 'OK'
    });
});

// Health check (Rate limiter 적용 전에 정의)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'connected'
    });
});

// Rate limiting (다른 /api 경로들에만 적용)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // 최대 100 요청
    message: {
        success: false,
        error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// health를 제외한 api 경로에만 rate limiting 적용
app.use('/api/', (req, res, next) => {
    if (req.path === '/health') {
        return next();
    }
    return limiter(req, res, next);
});

// Stats endpoint (통합)
app.get('/api/stats', async (req, res) => {
    const { ResponseHelper } = require('./utils/helpers');

    try {
        const queries = [
            'SELECT COUNT(*) as count FROM comments WHERE is_deleted = 0',
            'SELECT COUNT(*) as count FROM comments WHERE DATE(created_at) = CURDATE() AND is_deleted = 0',
            'SELECT COUNT(DISTINCT user_name) as count FROM comments WHERE is_deleted = 0',
            'SELECT COUNT(DISTINCT project_id) as count FROM comments WHERE is_deleted = 0',
            'SELECT COUNT(*) as count FROM inquiries',
            'SELECT COUNT(*) as count FROM inquiries WHERE DATE(created_at) = CURDATE()'
        ];

        const results = await Promise.all(
            queries.map(query => db.query(query))
        );

        const stats = {
            comments: {
                total: results[0][0][0].count,
                today: results[1][0][0].count,
                uniqueUsers: results[2][0][0].count,
                activeProjects: results[3][0][0].count
            },
            inquiries: {
                total: results[4][0][0].count,
                today: results[5][0][0].count
            }
        };

        ResponseHelper.sendSuccess(res, stats, '전체 통계를 성공적으로 조회했습니다');
    } catch (error) {
        console.error('전체 통계 조회 오류:', error);
        ResponseHelper.sendError(res, 500, '통계 조회에 실패했습니다', error);
    }
});

// API 라우터 연결
app.use('/api', apiRoutes);

// ====================
// ERROR HANDLING
// ====================

// 404 핸들러 (모든 라우트 정의 후 마지막에)
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: '요청한 리소스를 찾을 수 없습니다',
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    });
});

// 글로벌 에러 핸들러
app.use((error, req, res, next) => {
    console.error('서버 에러:', error);

    res.status(error.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? '서버 내부 오류가 발생했습니다'
            : error.message,
        timestamp: new Date().toISOString()
    });
});

// ====================
// SERVER STARTUP
// ====================

async function startServer() {
    try {
        const dbConnected = await db.initialize();

        const server = app.listen(PORT, () => {
            console.log(`🚀 포트폴리오 API 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
            console.log(`📊 현재 활성화된 엔드포인트:`);
            console.log(`   === 기본 ===`);
            console.log(`   GET    /test                           - 서버 테스트`);
            console.log(`   GET    /api/health                     - 서버 상태 확인`);
            console.log(`   GET    /api/stats                      - 전체 통계`);
            console.log(`   === API 라우터 ===`);
            console.log(`   GET    /api/comments                   - 댓글 API`);
            console.log(`   GET    /api/portfolio                  - 포트폴리오 API`);
            console.log(`   GET    /api/faq                        - FAQ API`);
            console.log(`   GET    /api/inquiries                  - 문의 API`);
            console.log(`💾 데이터베이스: ${dbConnected ? '연결됨' : '연결 안됨 (개발 모드)'}`);
            console.log(`🔒 보안: Rate limiting, Helmet, Input sanitization 적용됨`);
        });

        return server;
    } catch (error) {
        console.error('서버 시작 실패:', error);
        process.exit(1);
    }
}

// ====================
// GRACEFUL SHUTDOWN
// ====================

const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} 신호를 받았습니다. 서버를 안전하게 종료합니다...`);

    try {
        await db.close();
    } catch (error) {
        console.error('❌ 데이터베이스 연결 종료 오류:', error);
    }

    process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// 서버 시작
startServer();

module.exports = app;