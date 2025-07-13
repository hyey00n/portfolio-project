// routes/Home.jsx - 강제 리렌더링 방식으로 수정
import React, { useEffect, useState } from 'react';
import HomeSidebar from '../components/HomeSidebar';
import HomeTopTabs from '../components/HomeTopTabs';
import NoticeSection from '../components/NoticeSection';
import FaqSection from '../components/FaqSection';
import InquirySection from '../components/InquirySection';

function Home({ homeSection, setHomeSection }) {
    const [forceRender, setForceRender] = useState(0);

    // homeSection이 변경될 때마다 강제 리렌더링
    useEffect(() => {
        console.log('🏠 Home - homeSection 변경됨:', homeSection);
        setForceRender(prev => prev + 1);
    }, [homeSection]);

    const handleMenuChange = (newMenu) => {
        console.log('🔄 Home - 메뉴 변경:', newMenu);
        setHomeSection(newMenu);
    };

    const renderContent = () => {
        console.log('🎨 Home - renderContent 호출, homeSection:', homeSection, 'forceRender:', forceRender);

        switch(homeSection) {
            case 'notice':
                console.log('📄 NoticeSection 렌더링');
                return <NoticeSection key={`notice-${forceRender}`} />;
            case 'faq':
                console.log('❓ FaqSection 렌더링');
                return <FaqSection key={`faq-${forceRender}`} />;
            case 'inquiry':
                console.log('💬 InquirySection 렌더링');
                return <InquirySection key={`inquiry-${forceRender}`} />;
            default:
                console.log('📄 기본 NoticeSection 렌더링');
                return <NoticeSection key={`default-${forceRender}`} />;
        }
    };

    return (
        <div className="outer-layout-bg">
            <div className="mypage-2col-container">
                {/* 데스크톱 사이드바 */}
                <div className="desktop-sidebar">
                    <HomeSidebar activeMenu={homeSection || 'notice'} setActiveMenu={handleMenuChange} />
                </div>

                <div className="my-main-content">
                    {/* 모바일 상단 탭 */}
                    <div className="mobile-top-tabs">
                        <HomeTopTabs activeMenu={homeSection || 'notice'} setActiveMenu={handleMenuChange} />
                    </div>

                    {renderContent()}
                </div>
            </div>

            <style>
                {`
                @media (min-width: 1024px) {
                    .desktop-sidebar { display: block; }
                    .mobile-top-tabs { display: none; }
                }
                @media (max-width: 1023px) {
                    .desktop-sidebar { display: none; }
                    .mobile-top-tabs { display: block; margin-bottom: 20px; }
                    .mypage-2col-container { display: block !important; }
                    .my-main-content { width: 100% !important; margin-left: 0 !important; }
                }
            `}
            </style>
        </div>
    );
}

export default Home;