const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const { db } = require('../config/database');
const { Utils, ResponseHelper, Validator } = require('../utils/helpers');

// 댓글 작성 제한
const commentLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5분
    max: 10, // 최대 10개 댓글
    message: {
        success: false,
        error: '댓글 작성 제한에 도달했습니다. 잠시 후 다시 시도해주세요.',
    },
});

// ⭐ 1. 가장 구체적인 라우트를 먼저 배치




// 댓글 통계 (구체적인 경로)
router.get('/stats/summary', async (req, res) => {
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

// ⭐ 2. 모든 댓글 조회 (관리자용)
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Comments API working!",
        timestamp: new Date().toISOString()
    });
});

// ⭐ 3. 파라미터가 있는 라우트는 마지막에 배치
// 특정 프로젝트의 댓글 조회
router.get('/:projectId', async (req, res) => {
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
router.post('/:projectId', commentLimiter, async (req, res) => {
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

// 댓글 삭제 (소프트 삭제)
router.delete('/:commentId', async (req, res) => {
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

module.exports = router;