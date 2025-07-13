import React, { useState, useEffect } from 'react'; // useEffect 추가
import './styles/style.css';
import './styles/popup.css';
import './styles/webfont.css';
import './styles/info_style.css';
import './styles/common.css';

import GnbHeader from './components/GnbHeader';
import Home from './routes/Home';
import Gallery from './routes/Gallery';
import MobileNav from './routes/MobileNav';

function App() {
    const [activeTab, setActiveTab] = useState('홈');
    const [homeSection, setHomeSection] = useState('notice');
    const [pendingSection, setPendingSection] = useState(null);

    // 홈 탭으로 이동할 때 대기 중인 섹션 적용
    useEffect(() => {
        if (activeTab === '홈' && pendingSection) {
            setHomeSection(pendingSection);
            setPendingSection(null);
        }
    }, [activeTab, pendingSection]);

    const handleTabClick = (tabName) => {
        console.log('🔥 App - 탭 변경:', tabName);
        setActiveTab(tabName);
        setPendingSection(null); // 대기 중인 섹션 초기화
    };

    const handleHomeSectionChange = (section) => {
        console.log('🎯 App - 홈 섹션 변경:', section);

        if (activeTab === '홈') {
            // 이미 홈 탭이면 바로 섹션 변경
            setHomeSection(section);
        } else {
            // 다른 탭이면 홈으로 이동하면서 섹션 대기
            setPendingSection(section);
            setActiveTab('홈');
        }
    };

    console.log('📊 App 렌더링 - activeTab:', activeTab, 'homeSection:', homeSection, 'pendingSection:', pendingSection);

    // App.js
    const renderMainContent = () => {
        switch(activeTab) {
            case '홈':
                return (
                    <Home
                        key={`home-${homeSection}`} // key로 강제 리렌더링
                        homeSection={homeSection}
                        setHomeSection={setHomeSection}
                    />
                );
            case '추첨형':
                return <Gallery />;
            default:
                return (
                    <Home
                        key={`home-${homeSection}`} // key로 강제 리렌더링
                        homeSection={homeSection}
                        setHomeSection={setHomeSection}
                    />
                );
        }
    };

    return (
        <div id="container">
            <GnbHeader activeTab={activeTab} onTabClick={handleTabClick} />
            {renderMainContent()}

            <MobileNav
                activeTab={activeTab}
                onTabClick={handleTabClick}
                onHomeSectionChange={handleHomeSectionChange}
                homeSection={homeSection}
            />
        </div>
    );
}

export default App;