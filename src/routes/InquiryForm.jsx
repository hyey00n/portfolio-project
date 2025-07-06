import React, { useState, useEffect } from 'react';

// 공지사항 컴포넌트
function NoticeSection() {
    const [selectedNotice, setSelectedNotice] = useState(null);
    const noticeData = [
        {
            id: 1,
            title: "포트폴리오 업데이트 안내",
            date: "2024.12.15",
            content: "새로운 프로젝트들이 포트폴리오에 추가되었습니다.\n\n최근 진행한 UX/UI 리뉴얼 프로젝트와 서비스 디자인 케이스 스터디를 확인해보세요.\n\n더 자세한 내용은 개별 프로젝트 페이지에서 확인할 수 있습니다."
        },
        {
            id: 2,
            title: "디자인 시스템 케이스 스터디 공개",
            date: "2024.11.28",
            content: "스타트업에서 처음부터 구축한 디자인 시스템 케이스 스터디를 공개했습니다.\n\nFigma와 Storybook을 활용한 개발 연동 과정과 팀 협업 개선 사례를 상세히 다뤘습니다."
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
            <h2 className="h3-title">공지사항</h2>
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

// FAQ 컴포넌트 (기본 탭을 '기술적 이해도'로 변경)
function FaqSection() {
    const [activeTab, setActiveTab] = useState('기술적 이해도');
    const [searchQuery, setSearchQuery] = useState('');
    const [openAccordions, setOpenAccordions] = useState(new Set());
    const [faqData, setFaqData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
        // 초기 로딩 시 기술적 이해도 카테고리의 데이터를 가져옴
        fetchFaqData('기술적 이해도');
    }, []);

    // 카테고리 목록 가져오기 (에러 처리 강화)
    const fetchCategories = async () => {
        try {
            console.log('카테고리 요청 시작...');
            const response = await fetch('http://localhost:3001/api/faq/categories');

            // 응답이 JSON인지 확인
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(`서버에서 HTML 응답을 받았습니다. API 엔드포인트를 확인하세요.`);
            }

            const data = await response.json();
            console.log('카테고리 응답:', data);

            if (data.success) {
                setCategories(data.data);
                // 기술적 이해도가 있으면 그것을, 없으면 첫 번째를 기본값으로 설정
                if (data.data.includes('기술적 이해도')) {
                    setActiveTab('기술적 이해도');
                } else if (data.data.length > 0) {
                    setActiveTab(data.data[0]);
                }
            } else {
                throw new Error(data.message || '카테고리 로딩 실패');
            }
        } catch (error) {
            console.error('카테고리 로딩 오류:', error);
            setError('서버 연결에 문제가 있습니다. API 서버가 실행 중인지 확인해주세요.');
            // 임시 카테고리 데이터 (기술적 이해도를 첫 번째로)
            setCategories(['기술적 이해도', '디자인 프로세스', '협업 경험', '사용자 리서치', '비즈니스 임팩트']);
            setActiveTab('기술적 이해도');
        }
    };

    // FAQ 데이터 가져오기 (에러 처리 강화)
    const fetchFaqData = async (category = null) => {
        try {
            setLoading(true);
            setError(null);

            const url = category ? `http://localhost:3001/api/faq?category=${encodeURIComponent(category)}` : 'http://localhost:3001/api/faq';
            console.log('FAQ 요청:', url);

            const response = await fetch(url);

            // 응답이 JSON인지 확인
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('서버에서 HTML 응답을 받았습니다. API 엔드포인트를 확인하세요.');
            }

            const data = await response.json();
            console.log('FAQ 응답:', data);

            if (data.success) {
                setFaqData(data.data);
            } else {
                throw new Error(data.message || 'FAQ 로딩 실패');
            }
        } catch (error) {
            console.error('FAQ 데이터 로딩 오류:', error);
            setError('FAQ 데이터를 불러올 수 없습니다. 서버 상태를 확인해주세요.');
            setFaqData([]);
        } finally {
            setLoading(false);
        }
    };

    // 검색 기능 (에러 처리 강화)
    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            setIsSearchMode(false);
            fetchFaqData(activeTab);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:3001/api/faq/search?q=${encodeURIComponent(searchQuery)}`);

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('서버에서 HTML 응답을 받았습니다.');
            }

            const data = await response.json();

            if (data.success) {
                setSearchResults(data.data);
                setIsSearchMode(true);
                setOpenAccordions(new Set());
            } else {
                throw new Error(data.message || '검색 실패');
            }
        } catch (error) {
            console.error('검색 오류:', error);
            setError('검색 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleTabClick = (category) => {
        setActiveTab(category);
        setOpenAccordions(new Set());
        setIsSearchMode(false);
        setSearchQuery('');
        fetchFaqData(category);
    };

    const handleAccordionClick = (questionId) => {
        const newOpenAccordions = new Set(openAccordions);
        if (newOpenAccordions.has(questionId)) {
            newOpenAccordions.delete(questionId);
        } else {
            newOpenAccordions.add(questionId);
        }
        setOpenAccordions(newOpenAccordions);
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (!value.trim()) {
            setIsSearchMode(false);
            fetchFaqData(activeTab);
        }
    };

    const currentFaqData = isSearchMode ? searchResults : faqData;

    return (
        <>
            <h2 className="h3-title">자주하는 질문</h2>

            {/* 에러 메시지 표시 */}
            {error && (
                <div className="error-message" style={{
                    background: '#ffebee',
                    color: '#c62828',
                    padding: '10px',
                    marginBottom: '20px',
                    borderRadius: '4px'
                }}>
                    <p>{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            fetchCategories();
                            fetchFaqData();
                        }}
                        style={{ marginTop: '10px', padding: '5px 10px' }}
                    >
                        다시 시도
                    </button>
                </div>
            )}

            <div className="top-search-pos-right">
                <div className="search-fieldset">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        placeholder="검색어 입력"
                        className="inputBox-round"
                    />
                    <button
                        type="button"
                        className="btn-search"
                        onClick={handleSearch}
                        aria-label="검색"
                    ></button>
                </div>
            </div>

            {isSearchMode && (
                <div className="search-info">
                    <p>"{searchQuery}" 검색 결과: {searchResults.length}개</p>
                    <button
                        onClick={() => {
                            setIsSearchMode(false);
                            setSearchQuery('');
                            fetchFaqData(activeTab);
                        }}
                        className="btn-clear-search"
                    >
                        전체 보기
                    </button>
                </div>
            )}

            <div className="tab-type-tab-shadow">
                {!isSearchMode && (
                    <ul className="tab-content">
                        {categories.map(category => (
                            <li key={category}>
                                <a
                                    href={`#${category}`}
                                    className={activeTab === category ? 'active' : ''}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleTabClick(category);
                                    }}
                                >
                                    {category}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="tabcontent top">
                    <div id={activeTab}>
                        <section className="shadowBox3">
                            <div className="faq-accordion-caution">
                                {loading ? (
                                    <div className="loading">
                                        <p>로딩 중...</p>
                                    </div>
                                ) : currentFaqData.length > 0 ? (
                                    currentFaqData.map(faq => (
                                        <div key={faq.id}>
                                            <button
                                                className={`acc-title ${openAccordions.has(faq.id) ? 'active' : ''}`}
                                                onClick={() => handleAccordionClick(faq.id)}
                                            >
                                                {isSearchMode && (
                                                    <span className="category-badge">[{faq.category}]</span>
                                                )}
                                                {faq.question}
                                            </button>
                                            <div
                                                className="acc-content"
                                                style={{
                                                    maxHeight: openAccordions.has(faq.id) ? 'none' : '0',
                                                    overflow: 'hidden',
                                                    transition: 'max-height 0.3s ease'
                                                }}
                                            >
                                                <p className="in-text">{faq.answer}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-data">
                                        <p>
                                            {isSearchMode
                                                ? `"${searchQuery}"에 대한 검색 결과가 없습니다.`
                                                : '해당 카테고리에 등록된 FAQ가 없습니다.'
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

// 1:1 문의 컴포넌트 (문의확인리스트 탭 제거)
function InquirySection() {
    const [inquiryType, setInquiryType] = useState('0');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [agreed, setAgreed] = useState(false);

    const handleInquirySubmit = (e) => {
        e.preventDefault();

        if (!agreed) {
            alert('내용에 동의해주세요.');
            return;
        }
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        console.log({ inquiryType, title, content, file, agreed });
        alert('문의가 성공적으로 제출되었습니다.');

        // 폼 초기화
        setInquiryType('0');
        setTitle('');
        setContent('');
        setFile(null);
        setAgreed(false);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <>
            <h2 className="h3-title">1:1 문의하기</h2>
            <div>
                <section className="sec-customer">
                    <ul className="panel-input-col mt30">
                        <div className="flex">
                            <li className="row-item">
                                <span className="subject">문의유형</span>
                                <div className="conbox col-3">
                                    <div className="select-default left">
                                        <select
                                            name="inquiryType"
                                            id="inquiryType"
                                            value={inquiryType}
                                            onChange={(e) => setInquiryType(e.target.value)}
                                        >
                                            <option value="0">전체</option>
                                            <option value="portfolio">포트폴리오 관련</option>
                                            <option value="project">프로젝트 문의</option>
                                            <option value="collaboration">협업 제안</option>
                                            <option value="career">경력 문의</option>
                                            <option value="technical">기술 관련</option>
                                            <option value="etc">기타</option>
                                        </select>
                                    </div>
                                </div>
                            </li>
                            <li className="row-item">
                                <span className="subject">제목</span>
                                <div className="conbox left">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="제목을 입력해주세요"
                                    />
                                </div>
                            </li>
                        </div>
                    </ul>
                    <ul className="panel-input-col mt30">
                        <li className="row-item">
                            <span className="subject">내용 작성</span>
                            <textarea
                                name="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="내용을 작성해주세요"
                            />
                        </li>
                        <li className="row-item filebox">
                            <span className="subject">첨부파일</span>
                            <label htmlFor="file">
                                <div className="btn-upload">
                                    파일 업로드하기
                                    {file && <span> - {file.name}</span>}
                                </div>
                            </label>
                            <input
                                type="file"
                                name="file"
                                id="file"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </li>
                    </ul>
                    <ul className="auto-id-save auto-center">
                        <li className="auto-center">
                            <input
                                type="checkbox"
                                id="autologin"
                                name="auto"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                            />
                            <label htmlFor="autologin" className="checkBox">
                                <span></span>
                                <em className="txt">위 내용에 동의합니다</em>
                            </label>
                        </li>
                    </ul>
                    <div className="bwhalf mt40">
                        <button type="button" className="btnXl btnMainColor1" onClick={handleInquirySubmit}>
                            제출하기
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
}

// 사이드바 컴포넌트
function Sidebar({ activeMenu, setActiveMenu }) {
    const menuItems = [
        { id: 'notice', label: '업데이트 소식', active: activeMenu === 'notice' },
        { id: 'faq', label: '자주하는 질문', active: activeMenu === 'faq' },
        { id: 'inquiry', label: '문의하기', active: activeMenu === 'inquiry' }
    ];

    return (
        <div className="my-lnb-sidebar">
            <dl className="user-greeting">
                <dt>포트폴리오 FAQQQQQQQQQQQQQQQQQQQQ</dt>
                <dd>궁금한 것을 찾아보세요</dd>
            </dl>
            <div className="code-customer-menu">
                {menuItems.map(item => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={item.active ? 'active' : ''}
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveMenu(item.id);
                        }}
                    >
                        <i></i>{item.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

// 메인 컴포넌트
function InquiryForm() {
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
                <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                <div className="my-main-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default InquiryForm;