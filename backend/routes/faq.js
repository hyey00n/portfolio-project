const express = require('express');
const router = express.Router();

const { db } = require('../config/database');

// FAQ 목록 조회
router.get('/', async (req, res) => {
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

// FAQ 검색
router.get('/search', async (req, res) => {
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

// FAQ 카테고리 목록
router.get('/categories', async (req, res) => {
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

module.exports = router;