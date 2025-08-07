// pages/api/portfolio.js
export default function handler(req, res) {
    if (req.method === 'GET') {
        // 일단 테스트용 데이터로 응답
        res.status(200).json({
            success: true,
            message: "포트폴리오 API 작동!",
            data: [
                {
                    id: 1,
                    title: "테스트 프로젝트",
                    category: "웹개발"
                }
            ]
        });
    } else {
        res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }
}