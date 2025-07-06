import '../styles/style.css';
import '../styles/popup.css';
import '../styles/webfont.css';
import '../styles/info_style.css';
import '../styles/common.css';

function Footer() {
    const handleInquiryClick = () => {
        // 홈의 1:1문의하기로 이동하는 로직
        // 예: window.location.href = '/home#inquiry' 또는 React Router 사용
        console.log('1:1문의하기로 이동');
    };

    const handleHomeClick = () => {
        // 홈의 공지사항이 보이도록 하는 로직
        // 예: window.location.href = '/home#notice' 또는 React Router 사용
        console.log('홈 공지사항으로 이동');
    };

    const handleGalleryClick = () => {
        // 갤러리 추첨형으로 이동하는 로직
        // 예: window.location.href = '/gallery' 또는 React Router 사용
        console.log('갤러리 추첨형으로 이동');
    };

    const handleMoreClick = () => {
        // 오른쪽에서 70% 사이드바가 나오는 로직
        // 사이드바 상태 관리 함수 호출 또는 클래스 토글
        document.body.classList.add('sidebar-open');
        console.log('사이드바 열기');
    };

    return (
        <>
                <nav className="footer-nav-wrap">
                    <div className="ft-nav-list">
                        <a href="#" className="quest" onClick={handleInquiryClick}>
                            <i></i><span>문의하기</span>
                        </a>
                        <a href="#" className="home active" onClick={handleHomeClick}>
                            <i></i><span>홈</span>
                        </a>
                        <a href="#" className="gallery" onClick={handleGalleryClick}>
                            <i></i><span>갤러리</span>
                        </a>
                        <a href="#" className="menu" onClick={handleMoreClick}>
                            <i></i><span>더보기</span>
                        </a>
                    </div>
                </nav>
        </>
    )
}

export default Footer;