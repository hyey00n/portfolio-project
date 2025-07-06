const express = require('express');
const router = express.Router();

const { db } = require('../config/database');
const { ResponseHelper } = require('../utils/helpers');

// 모든 포트폴리오 데이터 조회
router.get('/', async (req, res) => {
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
router.get('/category/:category', async (req, res) => {
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

// 포트폴리오 통계 조회
router.get('/stats', async (req, res) => {
    try {
        const queries = [
            'SELECT COUNT(*) as count FROM workdata',
            'SELECT COUNT(DISTINCT category) as count FROM workdata WHERE category IS NOT NULL',
            'SELECT category, COUNT(*) as count FROM workdata WHERE category IS NOT NULL GROUP BY category'
        ];

        const results = await Promise.all(
            queries.map(query => db.query(query))
        );

        const stats = {
            totalItems: results[0][0][0].count,
            totalCategories: results[1][0][0].count,
            categoryBreakdown: results[2][0]
        };

        ResponseHelper.sendSuccess(res, stats, '포트폴리오 통계 조회 성공');
    } catch (error) {
        console.error('포트폴리오 통계 오류:', error);
        ResponseHelper.sendError(res, 500, '통계 조회에 실패했습니다', error);
    }
});

module.exports = router;