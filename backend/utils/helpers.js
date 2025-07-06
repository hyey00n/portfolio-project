const crypto = require('crypto');

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

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validateInquiryType(type) {
        const validTypes = ['포트폴리오관련', '협업제안', '기타'];
        return validTypes.includes(type);
    }
}

module.exports = {
    Utils,
    ResponseHelper,
    Validator
};