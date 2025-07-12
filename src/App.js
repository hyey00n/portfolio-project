import React, { useState } from 'react';
import GnbHeader from './components/GnbHeader';
import Home from './routes/Home'; // InquiryForm → Home으로 변경
import Gallery from './routes/Gallery';
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
                return <Home />;  // InquiryForm → Home으로 변경
            case '추첨형':
                return <Gallery />;
            case '즉석 추첨형':
                return (
                    <div className="space-body-top w1100">
                        <InquiryForm3 />
                    </div>
                );
            default:
                return <Home />;
        }
    };

    return (
        <div id="container">
            <GnbHeader activeTab={activeTab} onTabClick={handleTabClick} />
            {renderMainContent()}
            <MobileNav />
        </div>
    );
}

export default App;