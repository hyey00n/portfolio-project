import React, { useState } from 'react';

function NoticeSection() {
    const [selectedNotice, setSelectedNotice] = useState(null);

    const noticeData = [
        {
            id: 1,
            title: "디자이너 정혜윤 포트폴리오 소개",
            date: "2025.07.07",
            content: "문제를 즐기는 디자이너, 정혜윤입니다.\n\n저의 포트폴리오 방문을 진심으로 환영합니다. 이곳에서는 그래픽 및 웹디자인 작품을 동시에 볼 수 있습니다.\n\n문제를 마주하고 함께 해결하는 과정을 통해 늘 단기적이고 작은 목표라도 구체적인 계획을 가진 디자이너로 성장하고 있습니다.\n\n경험을 통해 업체의 방향성을 중요하게 생각하며, 효율적으로 업무 목표를 이루기 위해 최선을 다하겠다는 다짐을 합니다.\n\n제 디자이너로서의 포부는 업체와의 신뢰를 유지하고, 목표를 달성하기 위해 협력하고 효율적인 커뮤니케이션을 강조하는 것입니다.\n\n🎯 전문 분야: 웹디자인 & 그래픽디자인\n💡 핵심 가치: 문제 해결 & 효율적 소통"
        },
        {
            id: 2,
            title: "주요 경력사항 및 보유 자격증 안내",
            date: "2025.07.07",
            content: "📈 주요 경력사항\n\n피치스소프트 | 디자인팀 사원 (2023.10 ~ 2023.12)\n• 리워드앱, 영상채팅 스크린샷 제작\n• 리워드앱 웹/모바일 반응형 UX/UI 디자인\n• 리워드앱 웹/모바일 퍼블리싱\n사용 툴: Photoshop, Illustrator, HTML & CSS, jQuery, Figma\n\n해월동 복합문화센터 | 디자인팀 사원 (2022.11 ~ 2023.10)\n• 향수라벨지 및 디자인\n• 해월동프랜트월 홈페이지 제작\n사용 툴: Photoshop, Illustrator, HTML, CSS\n\n아이피버스 | 디자인팀 인턴 (2022.04 ~ 2022.07)\n• PC 메인 페이지 디자인\n• 앱 디자인 리뉴얼\n• 개인정보처리방침 반응형 유지보수\n사용 툴: Photoshop, Illustrator, HTML & CSS, jQuery, Figma\n\n토마토애드 | 디자인팀 사원 (2015.11 ~ 2016.12)\n• 어반웨딩스튜디오 팜플릿 디자인 및 발주\n• 대구보건소 안내표지판 디자인\n• 삼정그린코어 분양 카탈로그 및 광고\n사용 툴: Photoshop, Illustrator, InDesign\n\n🏆 보유 자격증\n• 웹디자인기능사 (한국산업인력공단, 2021.04)\n• 컬러리스트산업기사 (한국산업인력공단, 2018.08)\n• 컴퓨터그래픽스운용기능사 (한국산업인력공단, 2014.06)"
        }
    ];

    const handleNoticeClick = (noticeId) => {
        setSelectedNotice(selectedNotice === noticeId ? null : noticeId);
    };

    const handleBackToList = () => {
        setSelectedNotice(null);
    };

    if (selectedNotice) {
        const notice = noticeData.find(n => n.id === selectedNotice);
        return (
            <>
                <h2 className="h3-title">공지사항</h2>
                <section className="shadowBox3">
                    <ul className="customer-table-detail">
                        <li className="title-area">
                            <p className="subject">{notice.title}</p>
                            <p className="date">{notice.date}</p>
                        </li>
                        <li className="textbox">
                            {notice.content.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    {index < notice.content.split('\n').length - 1 && <><br/><br/></>}
                                </React.Fragment>
                            ))}
                            <br/><br/>
                            <img src="../static/images/test-04.jpg" className="img" alt="공지사항 이미지" />
                        </li>
                    </ul>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button
                            type="button"
                            className="btnXl btnMainColor1"
                            onClick={handleBackToList}
                        >
                            목록으로 돌아가기
                        </button>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <h2 className="h3-title">디자이너알기</h2>
            <section className="shadowBox3">
                <ul className="customer-table-list">
                    {noticeData.map(notice => (
                        <li key={notice.id} className="item">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNoticeClick(notice.id);
                                }}
                            >
                                <p className="subject">
                                    <span>{notice.title}</span>
                                    <i className="more"></i>
                                </p>
                                <p className="date">{notice.date}</p>
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}

export default NoticeSection;