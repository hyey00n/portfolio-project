import React, { useState } from 'react';
// import Footer from './routes/Footer';
import GnbHeader from './components/GnbHeader';
import InquiryForm from './routes/InquiryForm';
import InquiryForm2 from './routes/InquiryForm2';
import InquiryForm3 from './routes/InquiryForm3';
import MobileNav from './routes/MobileNav';

function App() {
    const [activeTab, setActiveTab] = useState('홈');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const renderMainContent = () => {
        switch(activeTab) {
            case '홈':
                return <InquiryForm />; // 이미 outer-layout-bg를 포함하고 있음
            case '추첨형':
                return (
                    <div >
                        <InquiryForm2 />
                    </div>
                );
            case '즉석 추첨형':
                return (
                    <div className="space-body-top w1100">
                        <InquiryForm3 />
                    </div>
                );
            default:
                return <InquiryForm />; // 기본값
        }
    };

    return (
        <div id="container">
            {/* 헤더 - 네비메뉴 + 드롭다운 메뉴 포함 */}
            <GnbHeader activeTab={activeTab} onTabClick={handleTabClick} />

            {/* 메인 컨텐츠 영역 - 각 컴포넌트가 자체 배경을 가짐 */}
            {renderMainContent()}

            {/* 푸터 */}
            {/*<Footer />*/}

            {/* 모바일 네비게이션 */}
            <MobileNav />
        </div>
    );
}

export default App;