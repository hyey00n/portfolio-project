import React, { useState } from 'react';
import HomeSidebar from '../components/HomeSidebar';
import HomeTopTabs from '../components/HomeTopTabs';
import NoticeSection from '../components/NoticeSection';
import FaqSection from '../components/FaqSection';
import InquirySection from '../components/InquirySection';
import '../styles/style.css';
import '../styles/popup.css';
import '../styles/webfont.css';
import '../styles/info_style.css';
import '../styles/common.css';

function Home() {
    const [activeMenu, setActiveMenu] = useState('notice');

    const renderContent = () => {
        switch(activeMenu) {
            case 'notice':
                return <NoticeSection />;
            case 'faq':
                return <FaqSection />;
            case 'inquiry':
                return <InquirySection />;
            default:
                return <NoticeSection />;
        }
    };

    return (
        <div className="outer-layout-bg">
            <div className="mypage-2col-container">
                {/* 데스크톱 사이드바 */}
                <div className="desktop-sidebar">
                    <HomeSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                </div>

                <div className="my-main-content">
                    {/* 모바일 상단 탭 */}
                    <div className="mobile-top-tabs">
                        <HomeTopTabs activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                    </div>

                    {renderContent()}
                </div>
            </div>

            {/* 반응형 CSS */}
            <style jsx>{`
                /* 데스크톱 (1024px 이상): 사이드바 표시, 상단 탭 숨김 */
                @media (min-width: 1024px) {
                    .desktop-sidebar {
                        display: block;
                    }
                    .mobile-top-tabs {
                        display: none;
                    }
                }

                /* 모바일/태블릿 (1024px 미만): 상단 탭 표시, 사이드바 숨김 */
                @media (max-width: 1023px) {
                    .desktop-sidebar {
                        display: none;
                    }
                    .mobile-top-tabs {
                        display: block;
                        margin-bottom: 20px;
                    }
                    
                    /* 모바일에서 mypage-2col-container 레이아웃 조정 */
                    .mypage-2col-container {
                        display: block !important;
                    }
                    
                    .my-main-content {
                        width: 100% !important;
                        margin-left: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default Home;