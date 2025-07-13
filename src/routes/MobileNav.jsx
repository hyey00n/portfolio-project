// src/routes/MobileNav.jsx - 수정된 버전
import React from 'react';

function MobileNav({ activeTab, onTabClick, onHomeSectionChange, homeSection }) {
    const handleHomeClick = (e) => {
        e.preventDefault();
        onHomeSectionChange('notice');  // 이것만 호출
    };

    const handleGalleryClick = (e) => {
        e.preventDefault();
        onTabClick('추첨형');
    };

    const handleFaqClick = (e) => {
        e.preventDefault();
        onHomeSectionChange('faq');  // 이것만 호출
    };

    const handleContactClick = (e) => {
        e.preventDefault();
        onHomeSectionChange('inquiry');  // 이것만 호출
    };

    return (
        <nav className="footer-nav-wrap">
            <div className="ft-nav-list">
                <a href="#"
                   className={`home ${activeTab === '홈' && homeSection === 'notice' ? 'active' : ''}`}
                   onClick={handleHomeClick}>
                    <i className="home-icon"></i><span>홈</span>
                </a>
                <a href="#"
                   className={`gallery ${activeTab === '추첨형' ? 'active' : ''}`}
                   onClick={handleGalleryClick}>
                    <i className="gallery-icon"></i><span>갤러리</span>
                </a>
                <a href="#"
                   className={`faq ${activeTab === '홈' && homeSection === 'faq' ? 'active' : ''}`}
                   onClick={handleFaqClick}>
                    <i className="faq-icon"></i><span>FAQ</span>
                </a>
                <a href="#"
                   className={`contact ${activeTab === '홈' && homeSection === 'inquiry' ? 'active' : ''}`}
                   onClick={handleContactClick}>
                    <i className="contact-icon"></i><span>문의</span>
                </a>
            </div>
        </nav>
    );
}

export default MobileNav;