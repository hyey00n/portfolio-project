const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ====================
// SECURITY MIDDLEWARE
// ====================

// Basic security headers
app.use(helmet({
    contentSecurityPolicy: false  // 개발 중에는 CSP 비활성화
}));


// Rate limiting
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

const commentLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5분
    max: 10, // 최대 10개 댓글
    message: {
        success: false,
        error: '댓글 작성 제한에 도달했습니다. 잠시 후 다시 시도해주세요.',
    },
});

app.use('/api/', limiter);

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
// DATABASE CONFIGURATION
// ====================

class Database {
    constructor() {
        this.pool = null;
        this.isConnected = false;
    }

    createPool() {
        const dbConfig = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'webapp',
            password: process.env.DB_PASSWORD || 'webapp123',
            database: process.env.DB_NAME || 'comment_system',
            port: parseInt(process.env.DB_PORT) || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            acquireTimeout: 60000,
            timeout: 60000,
            reconnect: true,
            charset: 'utf8mb4',
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        };

        this.pool = mysql.createPool(dbConfig);
        return this.pool;
    }

    async initialize() {
        try {
            if (!this.pool) {
                this.createPool();
            }

            const connection = await this.pool.getConnection();
            console.log('✅ MySQL 연결 성공!');

            await this.createTables(connection);
            connection.release();

            this.isConnected = true;
            return true;
        } catch (err) {
            console.error('❌ 데이터베이스 초기화 실패:', err.message);

            if (process.env.NODE_ENV === 'production') {
                throw err;
            } else {
                console.warn('⚠️  개발 모드: 데이터베이스 없이 계속 실행됩니다.');
                return false;
            }
        }
    }

    async createTables(connection) {
        const tables = [
            {
                name: 'comments',
                query: `
                    CREATE TABLE IF NOT EXISTS comments (
                        id VARCHAR(16) PRIMARY KEY,
                        project_id VARCHAR(50) NOT NULL,
                        user_name VARCHAR(50) NOT NULL,
                        comment_text TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        is_deleted TINYINT(1) DEFAULT 0,
                        user_ip VARCHAR(45),
                        INDEX idx_project_id (project_id),
                        INDEX idx_created_at (created_at),
                        INDEX idx_is_deleted (is_deleted),
                        INDEX idx_user_ip (user_ip)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                `
            },
            {
                name: 'workdata',
                query: `
                    CREATE TABLE IF NOT EXISTS workdata (
                        id INT PRIMARY KEY,
                        badge VARCHAR(50),
                        badge_text VARCHAR(20),
                        image VARCHAR(500),
                        mall_name VARCHAR(100),
                        title VARCHAR(255) NOT NULL,
                        participants VARCHAR(100),
                        winners VARCHAR(100),
                        deadline VARCHAR(100),
                        type VARCHAR(50),
                        skills JSON,
                        url VARCHAR(500),
                        content TEXT,
                        category VARCHAR(50),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        INDEX idx_category (category),
                        INDEX idx_type (type)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                `
            }
        ];

        for (const table of tables) {
            await connection.execute(table.query);
            console.log(`✅ ${table.name} 테이블 확인/생성 완료`);
        }
    }

    async query(sql, params = []) {
        if (!this.pool) {
            throw new Error('데이터베이스 연결이 설정되지 않았습니다');
        }
        return await this.pool.execute(sql, params);
    }

    async close() {
        if (this.pool) {
            await this.pool.end();
            this.isConnected = false;
            console.log('✅ 데이터베이스 연결이 안전하게 종료되었습니다.');
        }
    }
}

const db = new Database();

// ====================
// UTILITY FUNCTIONS
// ====================

class Utils {
    static generateId() {
        return crypto.randomBytes(8).toString('hex');
    }

    static formatTimeAgo(timestamp) {
        const now = new Date();
        const commentTime = new Date(timestamp);
        const diff = Math.floor((now - commentTime) / 1000);

        if (diff < 60) return '방금 전';
        if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
        if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;

        return commentTime.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input.trim().replace(/[<>]/g, '');
    }

    static getClientIp(req) {
        return req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
            'unknown';
    }
}

// ====================
// RESPONSE HELPERS
// ====================

class ResponseHelper {
    static sendError(res, status, message, error = null) {
        console.error(`Error ${status}: ${message}`, error?.message || '');
        res.status(status).json({
            success: false,
            error: message,
            timestamp: new Date().toISOString()
        });
    }

    static sendSuccess(res, data, message = 'Success') {
        res.json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }
}

// ====================
// VALIDATION FUNCTIONS
// ====================

class Validator {
    static validateProjectId(projectId) {
        if (!projectId || typeof projectId !== 'string') {
            return '프로젝트 ID가 필요합니다';
        }
        if (projectId.length > 50) {
            return '프로젝트 ID는 50자 이하여야 합니다';
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(projectId)) {
            return '프로젝트 ID는 영문, 숫자, 언더스코어, 하이픈만 사용 가능합니다';
        }
        return null;
    }

    static validateUsername(username) {
        if (!username || typeof username !== 'string') {
            return '사용자명이 필요합니다';
        }
        const trimmed = username.trim();
        if (trimmed.length === 0) {
            return '사용자명이 필요합니다';
        }
        if (trimmed.length > 50) {
            return '사용자명은 50자 이하여야 합니다';
        }
        if (trimmed.length < 2) {
            return '사용자명은 2자 이상이어야 합니다';
        }
        return null;
    }

    static validateContent(content) {
        if (!content || typeof content !== 'string') {
            return '댓글 내용이 필요합니다';
        }
        const trimmed = content.trim();
        if (trimmed.length === 0) {
            return '댓글 내용이 필요합니다';
        }
        if (trimmed.length > 1000) {
            return '댓글은 1000자 이하여야 합니다';
        }
        if (trimmed.length < 1) {
            return '댓글은 1자 이상이어야 합니다';
        }
        return null;
    }

    static validatePagination(limit, offset) {
        const validLimit = Math.min(Math.max(parseInt(limit) || 50, 1), 100);
        const validOffset = Math.max(parseInt(offset) || 0, 0);
        return { limit: validLimit, offset: validOffset };
    }
}

// ====================
// ROUTES
// ====================

// Health check
app.get('/api/health', (req, res) => {
    ResponseHelper.sendSuccess(res, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: db.isConnected ? 'connected' : 'disconnected'
    }, 'API 서버가 정상 작동 중입니다');
});

// Test endpoint
app.get('/api/test', (req, res) => {
    ResponseHelper.sendSuccess(res, {
        message: 'API 테스트 성공',
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version
    });
});

// 특정 프로젝트의 댓글 조회
app.get('/api/comments/:projectId', async (req, res) => {
    const projectId = req.params.projectId;
    const { limit, offset } = Validator.validatePagination(req.query.limit, req.query.offset);

    const projectIdError = Validator.validateProjectId(projectId);
    if (projectIdError) {
        return ResponseHelper.sendError(res, 400, projectIdError);
    }

    try {
        console.log(`프로젝트 ${projectId} 댓글 조회 (limit: ${limit}, offset: ${offset})`);

        const query = `
            SELECT id, user_name, comment_text, created_at
            FROM comments
            WHERE project_id = ? AND is_deleted = 0
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [results] = await db.query(query, [projectId, limit, offset]);

        const comments = results.map((comment) => ({
            id: comment.id,
            username: Utils.sanitizeInput(comment.user_name),
            timeAgo: Utils.formatTimeAgo(comment.created_at),
            content: Utils.sanitizeInput(comment.comment_text),
            avatar: comment.user_name.substring(0, 1).toUpperCase(),
            createdAt: comment.created_at
        }));

        ResponseHelper.sendSuccess(res, comments, `${results.length}개의 댓글을 조회했습니다`);
    } catch (error) {
        console.error('댓글 조회 오류:', error);
        ResponseHelper.sendError(res, 500, '댓글을 불러오는데 실패했습니다', error);
    }
});

// 프로젝트에 댓글 추가
app.post('/api/comments/:projectId', commentLimiter, async (req, res) => {
    const projectId = req.params.projectId;
    const { username, content } = req.body;

    // 입력 검증
    const projectIdError = Validator.validateProjectId(projectId);
    if (projectIdError) {
        return ResponseHelper.sendError(res, 400, projectIdError);
    }

    const usernameError = Validator.validateUsername(username);
    if (usernameError) {
        return ResponseHelper.sendError(res, 400, usernameError);
    }

    const contentError = Validator.validateContent(content);
    if (contentError) {
        return ResponseHelper.sendError(res, 400, contentError);
    }

    try {
        const trimmedUsername = Utils.sanitizeInput(username);
        const trimmedContent = Utils.sanitizeInput(content);
        const userIp = Utils.getClientIp(req);

        console.log(`프로젝트 ${projectId}에 댓글 추가: ${trimmedUsername}`);

        const commentId = Utils.generateId();

        const query = `
            INSERT INTO comments (id, project_id, user_name, comment_text, created_at, updated_at, is_deleted, user_ip)
            VALUES (?, ?, ?, ?, NOW(), NOW(), 0, ?)
        `;

        await db.query(query, [commentId, projectId, trimmedUsername, trimmedContent, userIp]);

        const newComment = {
            id: commentId,
            username: trimmedUsername,
            timeAgo: '방금 전',
            content: trimmedContent,
            avatar: trimmedUsername.substring(0, 1).toUpperCase(),
            createdAt: new Date().toISOString()
        };

        console.log(`댓글 추가 성공: ${commentId}`);
        res.status(201);
        ResponseHelper.sendSuccess(res, newComment, '댓글이 성공적으로 추가되었습니다');
    } catch (error) {
        console.error('댓글 추가 오류:', error);
        ResponseHelper.sendError(res, 500, '댓글 추가에 실패했습니다', error);
    }
});

// 모든 댓글 조회 (관리자용)
app.get('/api/comments', async (req, res) => {
    const { limit, offset } = Validator.validatePagination(req.query.limit, req.query.offset);

    try {
        const query = `
            SELECT id, project_id, user_name, comment_text, created_at
            FROM comments
            WHERE is_deleted = 0
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [results] = await db.query(query, [limit, offset]);

        const comments = results.map((comment) => ({
            id: comment.id,
            username: Utils.sanitizeInput(comment.user_name),
            content: Utils.sanitizeInput(comment.comment_text),
            timeAgo: Utils.formatTimeAgo(comment.created_at),
            projectId: comment.project_id,
            createdAt: comment.created_at
        }));

        ResponseHelper.sendSuccess(res, comments, `${results.length}개의 댓글을 조회했습니다`);
    } catch (error) {
        console.error('전체 댓글 조회 오류:', error);
        ResponseHelper.sendError(res, 500, '댓글을 불러오는데 실패했습니다', error);
    }
});

// 댓글 통계
app.get('/api/stats', async (req, res) => {
    try {
        const queries = [
            'SELECT COUNT(*) as count FROM comments WHERE is_deleted = 0',
            'SELECT COUNT(*) as count FROM comments WHERE DATE(created_at) = CURDATE() AND is_deleted = 0',
            'SELECT COUNT(DISTINCT user_name) as count FROM comments WHERE is_deleted = 0',
            'SELECT COUNT(DISTINCT project_id) as count FROM comments WHERE is_deleted = 0'
        ];

        const results = await Promise.all(
            queries.map(query => db.query(query))
        );

        const stats = {
            totalComments: results[0][0][0].count,
            todayComments: results[1][0][0].count,
            uniqueUsers: results[2][0][0].count,
            activeProjects: results[3][0][0].count
        };

        ResponseHelper.sendSuccess(res, stats, '통계를 성공적으로 조회했습니다');
    } catch (error) {
        console.error('통계 조회 오류:', error);
        ResponseHelper.sendError(res, 500, '통계 조회에 실패했습니다', error);
    }
});

// 댓글 삭제 (소프트 삭제)
app.delete('/api/comments/:commentId', async (req, res) => {
    const commentId = req.params.commentId;

    if (!commentId || typeof commentId !== 'string') {
        return ResponseHelper.sendError(res, 400, '댓글 ID가 필요합니다');
    }

    try {
        const query = 'UPDATE comments SET is_deleted = 1, updated_at = NOW() WHERE id = ? AND is_deleted = 0';
        const [result] = await db.query(query, [commentId]);

        if (result.affectedRows === 0) {
            return ResponseHelper.sendError(res, 404, '댓글을 찾을 수 없거나 이미 삭제된 댓글입니다');
        }

        ResponseHelper.sendSuccess(res, { commentId }, '댓글이 성공적으로 삭제되었습니다');
    } catch (error) {
        console.error('댓글 삭제 오류:', error);
        ResponseHelper.sendError(res, 500, '댓글 삭제에 실패했습니다', error);
    }
});

// 모든 포트폴리오 데이터 조회
// 모든 포트폴리오 데이터 조회
// 모든 포트폴리오 데이터 조회 (DB 연결 버전)
app.get('/api/portfolio', async (req, res) => {
    console.log('🔥 포트폴리오 라우트 호출됨! (DB 연결)');

    try {
        const query = `
            SELECT 
                id, badge, badge_text, image, mall_name, title, 
                participants, winners, deadline, type, skills, 
                url, content, category, created_at
            FROM workdata 
            ORDER BY id
        `;

        const [results] = await db.query(query);
        console.log(`포트폴리오 데이터 ${results.length}개 조회 완료`);

        // skills 필드가 JSON 문자열인 경우 파싱
        const processedResults = results.map(item => ({
            ...item,
            skills: typeof item.skills === 'string' ?
                (item.skills.startsWith('[') || item.skills.startsWith('{') ?
                    JSON.parse(item.skills) : item.skills) :
                item.skills
        }));

        ResponseHelper.sendSuccess(res, processedResults, '포트폴리오 데이터 조회 성공');
    } catch (error) {
        console.error('포트폴리오 조회 오류:', error);
        ResponseHelper.sendError(res, 500, '포트폴리오 데이터를 불러올 수 없습니다', error);
    }
});

// 특정 카테고리 포트폴리오 데이터 조회
app.get('/api/portfolio/category/:category', async (req, res) => {
    const category = req.params.category;

    if (!category || typeof category !== 'string') {
        return ResponseHelper.sendError(res, 400, '카테고리가 필요합니다');
    }

    try {
        const query = `
            SELECT
                id, badge, badge_text, image, mall_name, title,
                participants, winners, deadline, type, skills,
                url, content, category, created_at
            FROM workdata
            WHERE category = ?
            ORDER BY id
        `;

        const [results] = await db.query(query, [category]);
        console.log(`카테고리 ${category}: ${results.length}개 데이터 조회 완료`);

        // skills 필드가 JSON 문자열인 경우 파싱
        const processedResults = results.map(item => ({
            ...item,
            skills: typeof item.skills === 'string' ?
                (item.skills.startsWith('[') || item.skills.startsWith('{') ?
                    JSON.parse(item.skills) : item.skills) :
                item.skills
        }));

        ResponseHelper.sendSuccess(res, processedResults, `카테고리 ${category} 데이터 조회 성공`);
    } catch (error) {
        console.error('카테고리별 포트폴리오 조회 오류:', error);
        ResponseHelper.sendError(res, 500, '포트폴리오 데이터를 불러올 수 없습니다', error);
    }
});
// ====================
// ERROR HANDLING
// ====================





// ====================
// SERVER STARTUP
// ====================

async function startServer() {
    try {
        const dbConnected = await db.initialize();

        const server = app.listen(PORT, () => {
            console.log(`🚀 댓글 시스템 API 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
            console.log(`📊 API 엔드포인트:`);
            console.log(`   === 기본 ===`);
            console.log(`   GET    /api/health                     - 서버 상태 확인`);
            console.log(`   GET    /api/test                       - 서버 테스트`);
            console.log(`   === 댓글 API ===`);
            console.log(`   GET    /api/comments/:projectId        - 특정 프로젝트 댓글 조회`);
            console.log(`   POST   /api/comments/:projectId        - 댓글 추가`);
            console.log(`   GET    /api/comments                   - 모든 댓글 조회 (관리자용)`);
            console.log(`   DELETE /api/comments/:commentId        - 댓글 삭제`);
            console.log(`   GET    /api/stats                      - 댓글 통계`);
            console.log(`   === 포트폴리오 API ===`);
            console.log(`   GET    /api/portfolio                  - 모든 포트폴리오 조회`);
            console.log(`   GET    /api/portfolio/category/:cat    - 카테고리별 포트폴리오 조회`);
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


// server.js - FAQ API (정리된 버전, 중복 제거)

// FAQ API 수정 버전 (db.query 사용)
app.get('/api/faq/search', async (req, res) => {
    try {
        const { q: searchTerm } = req.query;

        if (!searchTerm || searchTerm.trim() === '') {
            const [results] = await db.query('SELECT * FROM faq ORDER BY category, id');
            return res.json({
                success: true,
                data: results,
                total: results.length,
                searchTerm: ''
            });
        }

        const searchPattern = `%${searchTerm}%`;
        const [results] = await db.query(`
            SELECT * FROM faq
            WHERE question LIKE ? OR answer LIKE ? OR category LIKE ?
            ORDER BY
                CASE
                    WHEN question LIKE ? THEN 1
                    WHEN category LIKE ? THEN 2
                    ELSE 3
                    END, id
        `, [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern]);

        res.json({
            success: true,
            data: results,
            total: results.length,
            searchTerm
        });
    } catch (error) {
        console.error('FAQ 검색 오류:', error);
        res.status(500).json({
            success: false,
            message: '검색 중 오류가 발생했습니다.',
            error: error.message
        });
    }
});

// FAQ 카테고리 목록 API
app.get('/api/faq/categories', async (req, res) => {
    try {
        const query = 'SELECT DISTINCT category FROM faq ORDER BY category';
        const [results] = await db.query(query);

        const categories = results.map(row => row.category);

        res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error('FAQ 카테고리 오류:', error);
        res.status(500).json({
            success: false,
            message: '카테고리 목록을 불러오는 중 오류가 발생했습니다.',
            error: error.message
        });
    }
});
app.get('/api/faq', async (req, res) => {
    try {
        const { category } = req.query;

        let query = 'SELECT * FROM faq';
        let params = [];

        if (category) {
            query += ' WHERE category = ? ORDER BY id';
            params = [category];
        } else {
            query += ' ORDER BY category, id';
        }

        const [results] = await db.query(query, params);

        res.json({
            success: true,
            data: results,
            total: results.length
        });

    } catch (error) {
        console.error('FAQ 목록 오류:', error);
        res.status(500).json({
            success: false,
            message: 'FAQ 목록을 불러오는 중 오류가 발생했습니다.',
            error: error.message
        });
    }
});

// 서버 시작
startServer();



module.exports = app;