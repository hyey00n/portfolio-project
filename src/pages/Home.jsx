// routes/Home.jsx - 완전히 다른 접근 방법
import React, { useEffect } from 'react';
import HomeSidebar from '../components/HomeSidebar';
import HomeTopTabs from '../components/HomeTopTabs';
import NoticeSection from '../components/NoticeSection';
import FaqSection from '../components/FaqSection';
import InquirySection from '../components/InquirySection';

function Home({ homeSection, setHomeSection }) {
    console.log('🔄 Home 컴포넌트 렌더링 - homeSection:', homeSection);

    const handleMenuChange = (newMenu) => {
        console.log('🔄 Home - 메뉴 변경:', newMenu);
        setHomeSection(newMenu);
    };

    const renderContent = () => {
        console.log('🎨 Home - renderContent 호출, homeSection:', homeSection);

        // activeMenu 계산 제거하고 직접 homeSection 사용
        switch(homeSection) {
            case 'notice':
                console.log('📄 NoticeSection 렌더링');
                return <NoticeSection />;
            case 'faq':
                console.log('❓ FaqSection 렌더링');
                return <FaqSection />;
            case 'inquiry':
                console.log('💬 InquirySection 렌더링');
                return <InquirySection />;
            default:
                console.log('📄 기본 NoticeSection 렌더링');
                return <NoticeSection />;
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