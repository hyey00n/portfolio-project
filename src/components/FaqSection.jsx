import React, { useState, useEffect } from 'react';

function FaqSection() {
    console.log('🔥 FaqSection 컴포넌트가 렌더링됨!');
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
        fetchFaqData('기술적 이해도');
    }, []);



    const fetchCategories = async () => {
        try {
            console.log('카테고리 요청 시작...');
            const response = await fetch('http://localhost:3001/api/faq/categories');

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(`서버에서 HTML 응답을 받았습니다. API 엔드포인트를 확인하세요.`);
            }

            const data = await response.json();
            console.log('카테고리 응답:', data);

            if (data.success) {
                setCategories(data.data);
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
            setCategories(['기술적 이해도', '디자인 프로세스', '협업 경험', '사용자 리서치', '비즈니스 임팩트']);
            setActiveTab('기술적 이해도');
        }
    };

    const fetchFaqData = async (category = null) => {
        try {
            setLoading(true);
            setError(null);

            const url = category ? `http://localhost:3001/api/faq?category=${encodeURIComponent(category)}` : 'http://localhost:3001/api/faq';
            console.log('FAQ 요청:', url);

            const response = await fetch(url);

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

export default FaqSection;