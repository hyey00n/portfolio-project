import { useState, useEffect } from 'react';

export function usePortfolio() {
    const [portfolioData, setPortfolioData] = useState({});
    const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);

    const fetchPortfolioData = async () => {
        try {
            setIsLoadingPortfolio(true);
            console.log('포트폴리오 데이터 로딩 시작...');

            const response = await fetch('http://localhost:3001/api/portfolio');

            if (response.ok) {
                const result = await response.json();
                console.log('포트폴리오 API 응답:', result);

                if (result.success && result.data) {
                    const groupedData = {};
                    result.data.forEach(item => {
                        if (!groupedData[item.category]) {
                            groupedData[item.category] = [];
                        }

                        let parsedSkills = [];
                        try {
                            parsedSkills = JSON.parse(item.skills);
                        } catch (e) {
                            console.warn('스킬 파싱 오류:', item.skills);
                            parsedSkills = [];
                        }

                        groupedData[item.category].push({
                            id: item.id,
                            badge: item.badge,
                            badgeText: item.badge_text,
                            image: item.image,
                            mallName: item.mall_name,
                            title: item.title,
                            participants: item.participants,
                            winners: item.winners,
                            deadline: item.deadline,
                            type: item.type,
                            skills: parsedSkills,
                            url: item.url,
                            content: item.content
                        });
                    });

                    setPortfolioData(groupedData);
                    console.log('포트폴리오 데이터 로드 완료:', groupedData);
                } else {
                    console.error('포트폴리오 API 응답 오류:', result.error);
                    setPortfolioData({});
                }
            } else {
                console.error('포트폴리오 불러오기 실패 - HTTP 상태:', response.status);
                setPortfolioData({});
            }
        } catch (error) {
            console.error('포트폴리오 불러오기 오류:', error);
            setPortfolioData({});
        } finally {
            setIsLoadingPortfolio(false);
        }
    };

    useEffect(() => {
        fetchPortfolioData();
    }, []);

    return {
        portfolioData,
        isLoadingPortfolio,
        fetchPortfolioData
    };
}