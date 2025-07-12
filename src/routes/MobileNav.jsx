import '../styles/style.css';
import '../styles/popup.css';
import '../styles/webfont.css';
import '../styles/info_style.css';
import '../styles/common.css';

function Footer() {
    const handleHomeClick = () => {
        // 홈으로 이동하는 로직
        // 예: window.location.href = '/home' 또는 React Router 사용
        console.log('홈으로 이동');
    };

    const handleAboutClick = () => {
        // About 페이지로 이동하는 로직
        // 예: window.location.href = '/about' 또는 React Router 사용
        console.log('About 페이지로 이동');
    };

    const handleGalleryClick = () => {
        // 갤러리로 이동하는 로직
        // 예: window.location.href = '/gallery' 또는 React Router 사용
        console.log('갤러리로 이동');
    };

    const handleFaqClick = () => {
        // FAQ 페이지로 이동하는 로직
        // 예: window.location.href = '/faq' 또는 React Router 사용
        console.log('FAQ 페이지로 이동');
    };

    const handleContactClick = () => {
        // 문의하기 페이지로 이동하는 로직
        // 예: window.location.href = '/contact' 또는 React Router 사용
        console.log('문의하기 페이지로 이동');
    };

    return (
        <>
            <nav className="footer-nav-wrap">
                <div className="ft-nav-list">
                    <a href="#" className="home active" onClick={handleHomeClick}>
                        <i className="home-icon"></i><span>홈</span>
                    </a>
                    <a href="#" className="about" onClick={handleAboutClick}>
                        <i className="about-icon"></i><span>About</span>
                    </a>
                    <a href="#" className="gallery" onClick={handleGalleryClick}>
                        <i className="gallery-icon"></i><span>갤러리</span>
                    </a>
                    <a href="#" className="faq" onClick={handleFaqClick}>
                        <i className="faq-icon"></i><span>FAQ</span>
                    </a>
                    <a href="#" className="contact" onClick={handleContactClick}>
                        <i className="contact-icon"></i><span>문의</span>
                    </a>
                </div>
            </nav>
        </>
    )
}

export default Footer;