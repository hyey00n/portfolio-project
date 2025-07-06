require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// 기본 미들웨어만
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 테스트 라우트만
app.get('/test', (req, res) => {
    res.json({
        message: 'Server is working!',
        timestamp: new Date().toISOString(),
        status: 'OK'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// 404 핸들러
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`🚀 임시 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
    console.log(`📡 테스트: http://localhost:${PORT}/test`);
});

module.exports = app;