import React, { useState, useEffect, useCallback } from 'react';

function InquiryForm2() {
    const [activeFilter, setActiveFilter] = useState('웹디자인');
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState('익명사용자');
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

    // DB에서 가져온 포트폴리오 데이터
    const [portfolioData, setPortfolioData] = useState({});
    const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);

    // 포트폴리오 데이터를 데이터베이스에서 불러오기
    const fetchPortfolioData = async () => {
        try {
            setIsLoadingPortfolio(true);
            console.log('포트폴리오 데이터 로딩 시작...');

            const response = await fetch('http://localhost:3001/api/portfolio');

            if (response.ok) {
                const result = await response.json();
                console.log('포트폴리오 API 응답:', result);

                if (result.success && result.data) {
                    // 카테고리별로 데이터 그룹화
                    const groupedData = {};
                    result.data.forEach(item => {
                        if (!groupedData[item.category]) {
                            groupedData[item.category] = [];
                        }

                        // skills JSON 파싱
                        let parsedSkills = [];
                        try {
                            parsedSkills = JSON.parse(item.skills);
                        } catch (e) {
                            console.warn('스킬 파싱 오류:', item.skills);
                            parsedSkills = [];
                        }

                        groupedData[item.category].push({
                            id: item.id,
                            badge: item.badge,
                            badgeText: item.badge_text,
                            image: item.image,
                            mallName: item.mall_name,
                            title: item.title,
                            participants: item.participants,
                            winners: item.winners,
                            deadline: item.deadline,
                            type: item.type,
                            skills: parsedSkills,
                            url: item.url,
                            content: item.content
                        });
                    });

                    setPortfolioData(groupedData);
                    console.log('포트폴리오 데이터 로드 완료:', groupedData);
                } else {
                    console.error('포트폴리오 API 응답 오류:', result.error);
                    setPortfolioData({});
                }
            } else {
                console.error('포트폴리오 불러오기 실패 - HTTP 상태:', response.status);
                setPortfolioData({});
            }
        } catch (error) {
            console.error('포트폴리오 불러오기 오류:', error);
            setPortfolioData({});
        } finally {
            setIsLoadingPortfolio(false);
        }
    };

    // 컴포넌트 마운트 시 포트폴리오 데이터 로드
    useEffect(() => {
        fetchPortfolioData();
    }, []);

    const handleFilterClick = (filterName) => {
        setActiveFilter(filterName);
        setCurrentItemIndex(0);
    };

    // 현재 카테고리 데이터 가져오기
    const getCurrentItems = () => {
        return portfolioData[activeFilter] || [];
    };

    const currentItems = getCurrentItems();
    const currentItem = currentItems[currentItemIndex];

    // 특정 프로젝트의 댓글을 데이터베이스에서 불러오기
    const fetchCommentsFromDB = async (projectId) => {
        try {
            console.log(`프로젝트 ${projectId} 댓글 로딩 시작...`);
            const response = await fetch(`http://localhost:3001/api/comments/${projectId}`);

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers.get('content-type'));

            if (response.ok) {
                const result = await response.json();
                console.log(`프로젝트 ${projectId} API 응답:`, result);

                if (result.success && result.data) {
                    return result.data;
                } else {
                    console.error('API 응답 오류:', result.error || '데이터 없음');
                    return [];
                }
            } else {
                console.error('댓글 불러오기 실패 - HTTP 상태:', response.status);
                const errorText = await response.text();
                console.error('에러 내용:', errorText);
                return [];
            }
        } catch (error) {
            console.error('댓글 불러오기 오류:', error);
            console.error('에러 상세:', error.message);
            return [];
        }
    };

    // 프로젝트별 댓글 불러오기
    const getCommentsForItem = useCallback(async (itemId) => {
        setIsLoadingComments(true);
        try {
            console.log(`프로젝트 ${itemId} 댓글 새로 로드`);

            const dbComments = await fetchCommentsFromDB(itemId);
            const allComments = dbComments;

            setComments(prev => ({
                ...prev,
                [itemId]: allComments
            }));

            console.log(`프로젝트 ${itemId} 댓글 로드 완료:`, allComments.length, '개');
        } catch (error) {
            console.error('댓글 로딩 오류:', error);
            setComments(prev => ({
                ...prev,
                [itemId]: []
            }));
        } finally {
            setIsLoadingComments(false);
        }
    }, []);

    // 댓글을 데이터베이스에 추가
    const addCommentToDB = async (projectId, username, content) => {
        try {
            console.log(`댓글 추가 시도: 프로젝트 ${projectId}`);
            const response = await fetch(`http://localhost:3001/api/comments/${projectId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    content: content
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('댓글 추가 API 응답:', result);

                if (result.success && result.data) {
                    return result.data;
                } else {
                    console.error('댓글 추가 실패:', result.error);
                    return null;
                }
            } else {
                console.error('댓글 추가 실패 - HTTP 상태:', response.status);
                const errorText = await response.text();
                console.error('에러 내용:', errorText);
                return null;
            }
        } catch (error) {
            console.error('댓글 추가 오류:', error);
            return null;
        }
    };

    // 현재 아이템이 변경될 때마다 댓글 로드
    useEffect(() => {
        if (currentItem) {
            if (!comments[currentItem.id]) {
                getCommentsForItem(currentItem.id);
            }
        }
    }, [currentItem?.id, getCommentsForItem]);

    // 강제로 댓글 새로고침하는 함수
    const refreshComments = () => {
        if (currentItem) {
            setComments(prev => {
                const updated = { ...prev };
                delete updated[currentItem.id];
                return updated;
            });
            getCommentsForItem(currentItem.id);
        }
    };

    const handlePrevItem = () => {
        if (currentItemIndex > 0) {
            setCurrentItemIndex(currentItemIndex - 1);
        }
    };

    const handleNextItem = () => {
        if (currentItemIndex < currentItems.length - 1) {
            setCurrentItemIndex(currentItemIndex + 1);
        }
    };

    // 댓글 추가 핸들러
    const handleAddComment = async () => {
        if (!newComment.trim() || !currentItem) return;

        const tempId = `temp_${Date.now()}`;
        const tempComment = {
            id: tempId,
            username: username.trim(),
            timeAgo: '방금 전',
            content: newComment.trim(),
            avatar: username.trim().substring(0, 1),
            isTemporary: true
        };

        const currentComments = comments[currentItem.id] || [];
        setComments(prev => ({
            ...prev,
            [currentItem.id]: [tempComment, ...currentComments]
        }));

        const commentText = newComment.trim();
        setNewComment('');

        try {
            const dbComment = await addCommentToDB(currentItem.id, username.trim(), commentText);

            if (dbComment) {
                setComments(prev => ({
                    ...prev,
                    [currentItem.id]: prev[currentItem.id].map(comment =>
                        comment.id === tempId ? {
                            ...dbComment,
                            avatar: dbComment.username?.substring(0, 1) || dbComment.avatar
                        } : comment
                    )
                }));
                console.log('댓글 추가 성공');
            } else {
                setComments(prev => ({
                    ...prev,
                    [currentItem.id]: prev[currentItem.id].filter(comment => comment.id !== tempId)
                }));
                setNewComment(commentText);
                alert('댓글 등록에 실패했습니다. 서버 연결을 확인해주세요.');
            }
        } catch (error) {
            console.error('댓글 추가 실패:', error);
            setComments(prev => ({
                ...prev,
                [currentItem.id]: prev[currentItem.id].filter(comment => comment.id !== tempId)
            }));
            setNewComment(commentText);
            alert('댓글 등록에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 카테고리별 개수 계산
    const getCategoryCount = (category) => {
        return portfolioData[category]?.length || 0;
    };

    // 댓글 모달 열기
    const openCommentModal = () => {
        setIsCommentModalOpen(true);
        if (currentItem && !comments[currentItem.id]) {
            getCommentsForItem(currentItem.id);
        }
    };

    // 댓글 모달 닫기
    const closeCommentModal = () => {
        setIsCommentModalOpen(false);
    };

    // 로딩 중일 때
    if (isLoadingPortfolio) {
        return (
            <div className="outer-layout-bg">
                <div className="mypage-2col-container">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p>포트폴리오를 불러오는 중...</p>
                            <div style={{ width: '50px', height: '50px', border: '3px solid #f3f3f3', borderTop: '3px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '20px auto' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 데이터가 없거나 현재 아이템이 없는 경우
    if (!currentItems.length || !currentItem) {
        return (
            <div className="outer-layout-bg">
                <div className="mypage-2col-container">
                    <div className="my-lnb-sidebar">
                        <dl className="user-greeting">
                            <dt>포트폴리오 갤러리</dt>
                            <dd>다양한 작품을 만나보세요</dd>
                        </dl>
                        <div className="code-customer-menu">
                            <a href="" className={activeFilter === '웹디자인' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleFilterClick('웹디자인'); }}>
                                <i></i>웹디자인 <span style={{ background: '#ff6b35', color: 'white', borderRadius: '10px', padding: '2px 6px', fontSize: '12px', marginLeft: '5px' }}>{getCategoryCount('웹디자인')}</span>
                            </a>
                            <a href="" className={activeFilter === 'UX/UI디자인' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleFilterClick('UX/UI디자인'); }}>
                                <i></i>UX/UI디자인 <span style={{ background: '#ff6b35', color: 'white', borderRadius: '10px', padding: '2px 6px', fontSize: '12px', marginLeft: '5px' }}>{getCategoryCount('UX/UI디자인')}</span>
                            </a>
                            <a href="" className={activeFilter === '그래픽디자인' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleFilterClick('그래픽디자인'); }}>
                                <i></i>그래픽디자인 <span style={{ background: '#ff6b35', color: 'white', borderRadius: '10px', padding: '2px 6px', fontSize: '12px', marginLeft: '5px' }}>{getCategoryCount('그래픽디자인')}</span>
                            </a>
                        </div>
                    </div>
                    <div className="my-main-content">
                        <h2 className="h3-title">포트폴리오 갤러리</h2>
                        <section className="shadowBox3">
                            <div style={{ padding: '50px', textAlign: 'center' }}>
                                <p>해당 카테고리에 작품이 없습니다.</p>
                                <button onClick={fetchPortfolioData} style={{ marginTop: '10px', padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                    다시 불러오기
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="outer-layout-bg">
            <div className="mypage-2col-container">
                {/* 왼쪽: 포트폴리오 카테고리 사이드바 */}
                <div className="my-lnb-sidebar">
                    <dl className="user-greeting">
                        <dt>포트폴리오 갤러리</dt>
                        <dd>다양한 작품을 만나보세요</dd>
                    </dl>
                    <div className="code-customer-menu">
                        <a href="" className={activeFilter === '웹디자인' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleFilterClick('웹디자인'); }}>
                            <i></i>웹디자인 <span style={{ background: '#ff6b35', color: 'white', borderRadius: '10px', padding: '2px 6px', fontSize: '12px', marginLeft: '5px' }}>{getCategoryCount('웹디자인')}</span>
                        </a>
                        <a href="" className={activeFilter === 'UX/UI디자인' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleFilterClick('UX/UI디자인'); }}>
                            <i></i>UX/UI디자인 <span style={{ background: '#ff6b35', color: 'white', borderRadius: '10px', padding: '2px 6px', fontSize: '12px', marginLeft: '5px' }}>{getCategoryCount('UX/UI디자인')}</span>
                        </a>
                        <a href="" className={activeFilter === '소형홍보물' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleFilterClick('소형홍보물'); }}>
                            <i></i>소형홍보물 <span style={{ background: '#ff6b35', color: 'white', borderRadius: '10px', padding: '2px 6px', fontSize: '12px', marginLeft: '5px' }}>{getCategoryCount('소형홍보물')}</span>
                        </a>
                        <a href="" className={activeFilter === '대형홍보물' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleFilterClick('대형홍보물'); }}>
                            <i></i>대형홍보물 <span style={{ background: '#ff6b35', color: 'white', borderRadius: '10px', padding: '2px 6px', fontSize: '12px', marginLeft: '5px' }}>{getCategoryCount('대형홍보물')}</span>
                        </a>
                        <a href="" className={activeFilter === '디지털디자인' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleFilterClick('디지털디자인'); }}>
                            <i></i>디지털디자인 <span style={{ background: '#ff6b35', color: 'white', borderRadius: '10px', padding: '2px 6px', fontSize: '12px', marginLeft: '5px' }}>{getCategoryCount('디지털디자인')}</span>
                        </a>
                    </div>
                </div>

                {/* 오른쪽: 메인 컨텐츠 영역 */}
                <div className="my-main-content">
                    <h2 className="h3-title">포트폴리오 갤러리</h2>

                    <div style={{ display: 'flex', gap: '20px', height: '75vh' }}>
                        {/* 중앙: 현재 작품 */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            <section className="shadowBox3" style={{ flex: 1, position: 'relative', width: '100%', overflow: 'hidden' }}>
                                <div className="swiper-slide" style={{ width: '100%', height: '100%', display: 'block' }}>
                                    <a href={currentItem.url} target="_blank" rel="noopener noreferrer" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>

                                        {/* 배지 그룹 */}
                                        <div className="badge-group" style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', zIndex: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <p className={`badge-pos-left ${currentItem.badge}`} style={{
                                                background: currentItem.badge === 'bright-blue' ? '#007bff' :
                                                    currentItem.badge === 'bright-green' ? '#28a745' :
                                                        currentItem.badge === 'bright-purple' ? '#6f42c1' :
                                                            currentItem.badge === 'bright-cyan' ? '#17a2b8' :
                                                                currentItem.badge === 'bright-teal' ? '#20c997' :
                                                                    currentItem.badge === 'bright-indigo' ? '#6610f2' :
                                                                        currentItem.badge === 'bright-red' ? '#dc3545' :
                                                                            currentItem.badge === 'bright-orange' ? '#fd7e14' :
                                                                                currentItem.badge === 'bright-yellow' ? '#ffc107' :
                                                                                    currentItem.badge === 'bright-pink' ? '#e83e8c' :
                                                                                        currentItem.badge === 'bright-brown' ? '#6c5ce7' : '#6c757d',
                                                color: 'white',
                                                padding: '6px 12px',
                                                borderRadius: '15px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                margin: 0,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                            }}>
                                                {currentItem.badgeText}
                                            </p>
                                        </div>

                                        {/* 이미지 박스 */}
                                        <div className="item-photo-box" style={{
                                            height: '320px', // 기존보다 높이 줄임
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: '#f8f9fa',
                                            overflow: 'hidden',
                                            borderRadius: '8px 8px 0 0'
                                        }}>
                                            <img
                                                src={currentItem.image}
                                                className="img"
                                                alt={currentItem.title}
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px 8px 0 0'
                                                }}
                                            />
                                        </div>

                                        {/* 정보 박스 */}
                                        <ul className="item-info-box" style={{
                                            listStyle: 'none',
                                            margin: 0,
                                            padding: '20px',
                                            background: 'white',
                                            borderRadius: '0 0 8px 8px',
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            {/* 회사 정보 */}
                                            <li style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '12px',
                                                paddingBottom: '12px',
                                                borderBottom: '1px solid #eee'
                                            }}>
                                                <div className="company-info" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <span className="mall" style={{
                                                        background: '#e9ecef',
                                                        color: '#495057',
                                                        padding: '4px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        fontWeight: '500'
                                                    }}>
                                                        {currentItem.mallName}
                                                    </span>
                                                    <span className="brand" style={{
                                                        background: '#007bff',
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        fontWeight: '500'
                                                    }}>
                                                        {currentItem.type}
                                                    </span>
                                                </div>
                                                <span className="deadline" style={{ fontSize: '12px', color: '#6c757d' }}>
                                                    {currentItem.deadline}
                                                </span>
                                            </li>

                                            {/* 캠페인 제목 */}
                                            <li className="campaign-title" style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                color: '#333',
                                                marginBottom: '12px',
                                                lineHeight: '1.4'
                                            }}>
                                                {currentItem.title}
                                            </li>

                                            {/* 프로젝트 정보 */}
                                            <li className="lottery-info" style={{
                                                display: 'flex',
                                                gap: '16px',
                                                marginBottom: '15px',
                                                fontSize: '14px'
                                            }}>
                                                <span className="participants" style={{ color: '#6c757d' }}>
                                                    참여: <strong style={{ color: '#333' }}>{currentItem.participants}</strong>
                                                </span>
                                                <span className="winners" style={{ color: '#6c757d' }}>
                                                    상태: <strong style={{ color: '#28a745' }}>{currentItem.winners}</strong>
                                                </span>
                                            </li>

                                            {/* 프로젝트 설명 */}
                                            <li style={{
                                                padding: '15px',
                                                background: '#f8f9fa',
                                                borderRadius: '8px',
                                                marginBottom: '15px',
                                                flex: 1
                                            }}>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '14px',
                                                    lineHeight: '1.6',
                                                    color: '#555'
                                                }}>
                                                    {currentItem.content}
                                                </p>
                                            </li>

                                            {/* 기술 스택 */}
                                            <li>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {currentItem.skills?.map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            style={{
                                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                                color: 'white',
                                                                padding: '5px 10px',
                                                                borderRadius: '15px',
                                                                fontSize: '12px',
                                                                fontWeight: '500',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                            }}
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </li>
                                        </ul>
                                    </a>
                                </div>

                                {/* 네비게이션 버튼들 */}
                                {currentItemIndex > 0 && (
                                    <button onClick={handlePrevItem} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>‹</button>
                                )}
                                {currentItemIndex < currentItems.length - 1 && (
                                    <button onClick={handleNextItem} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>›</button>
                                )}

                                {/* 댓글 아이콘 - 1024px 이하에서만 표시 */}
                                <button
                                    onClick={openCommentModal}
                                    style={{
                                        position: 'absolute',
                                        bottom: '20px',
                                        right: '20px',
                                        background: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '60px',
                                        height: '60px',
                                        cursor: 'pointer',
                                        fontSize: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 10,
                                        boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="comment-icon-mobile"
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#0056b3';
                                        e.target.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = '#007bff';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    💬
                                    {/* 댓글 개수 뱃지 */}
                                    {(comments[currentItem.id] || []).length > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            background: '#ff4757',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            fontSize: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                    {(comments[currentItem.id] || []).length}
                                </span>
                                    )}
                                </button>

                                {/* 인디케이터 */}
                                <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
                                    {currentItems.map((_, index) => (
                                        <div key={index} style={{ width: '10px', height: '10px', borderRadius: '50%', background: index === currentItemIndex ? '#007bff' : 'rgba(255,255,255,0.7)', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.2)', transition: 'all 0.3s ease' }} onClick={() => setCurrentItemIndex(index)} />
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* 오른쪽: 댓글 영역 - 1024px 이상에서만 표시 */}
                        <div className="comment-sidebar-desktop" style={{ width: '350px', flexShrink: 0 }}>
                            <section className="shadowBox3" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                                        실시간 댓글
                                        <span style={{ color: '#999', fontSize: '14px', marginLeft: '8px' }}>
                                    ({(comments[currentItem.id] || []).length})
                                            {isLoadingComments && ' 로딩중...'}
                                </span>
                                    </h3>
                                    <button
                                        onClick={refreshComments}
                                        style={{
                                            background: 'none',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            color: '#666'
                                        }}
                                        disabled={isLoadingComments}
                                    >
                                        🔄 새로고침
                                    </button>
                                </div>

                                {/* 댓글 목록 */}
                                <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px', maxHeight: 'calc(75vh - 200px)' }}>
                                    {isLoadingComments ? (
                                        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                            댓글을 불러오는 중...
                                        </div>
                                    ) : (comments[currentItem.id] || []).length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                            첫 번째 댓글을 남겨보세요! 💬
                                        </div>
                                    ) : (
                                        (comments[currentItem.id] || []).map(comment => (
                                            <div key={comment.id} style={{ display: 'flex', gap: '12px', padding: '15px 0', borderBottom: '1px solid #f8f9fa' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    background: comment.isTemporary ? '#ccc' : `linear-gradient(45deg, #667eea, #764ba2)`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    flexShrink: 0
                                                }}>
                                                    {comment.avatar}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                                <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                                                    {comment.username}
                                                </span>
                                                        <span style={{ fontSize: '12px', color: '#999' }}>
                                                    {comment.timeAgo}
                                                            {comment.isTemporary && ' (저장중...)'}
                                                </span>
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#555', wordBreak: 'break-word' }}>
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* 댓글 작성 - 하단 고정 */}
                                <div style={{ padding: '20px', borderTop: '1px solid #eee', background: '#fafafa', flexShrink: 0 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="닉네임"
                                            style={{ width: '100%', border: '1px solid #ddd', borderRadius: '6px', padding: '8px', fontSize: '14px', background: 'white', boxSizing: 'border-box' }}
                                        />
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="작품에 대한 감상을 남겨주세요..."
                                            style={{ width: '100%', minHeight: '60px', maxHeight: '120px', border: '1px solid #ddd', borderRadius: '8px', padding: '12px', resize: 'vertical', fontSize: '14px', background: 'white', boxSizing: 'border-box' }}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && e.ctrlKey) {
                                                    handleAddComment();
                                                }
                                            }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                                                💾 DB에 실시간 저장됨 (Ctrl+Enter: 빠른 등록)
                                            </p>
                                            <button
                                                onClick={handleAddComment}
                                                className="btnXl btnMainColor1"
                                                style={{ padding: '10px 20px', fontSize: '14px' }}
                                                disabled={!newComment.trim()}
                                            >
                                                등록
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* 댓글 모달 */}
            {isCommentModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={closeCommentModal}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '500px',
                        height: '80%',
                        maxHeight: '600px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }} onClick={(e) => e.stopPropagation()}>

                        {/* 모달 헤더 */}
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#f8f9fa'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                                💬 실시간 댓글
                                <span style={{ color: '#999', fontSize: '14px', marginLeft: '8px' }}>
                                    ({(comments[currentItem.id] || []).length})
                                    {isLoadingComments && ' 로딩중...'}
                                </span>
                            </h3>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <button
                                    onClick={refreshComments}
                                    style={{
                                        background: 'none',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        padding: '6px 12px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        color: '#666'
                                    }}
                                    disabled={isLoadingComments}
                                >
                                    🔄 새로고침
                                </button>
                                <button
                                    onClick={closeCommentModal}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '24px',
                                        cursor: 'pointer',
                                        color: '#999',
                                        lineHeight: 1
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* 작품 정보 미리보기 */}
                        <div style={{
                            padding: '15px 20px',
                            borderBottom: '1px solid #f0f0f0',
                            background: '#fafafa'
                        }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <img
                                    src={currentItem.image}
                                    alt={currentItem.title}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid #eee'
                                    }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                                        {currentItem.title}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                        {currentItem.mallName}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 댓글 목록 */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '20px',
                            maxHeight: 'calc(80vh - 300px)'
                        }}>
                            {isLoadingComments ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                    <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                                    댓글을 불러오는 중...
                                </div>
                            ) : (comments[currentItem.id] || []).length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>💬</div>
                                    <p style={{ fontSize: '16px' }}>첫 번째 댓글을 남겨보세요!</p>
                                    <p style={{ fontSize: '14px', color: '#bbb' }}>이 작품에 대한 생각을 공유해주세요</p>
                                </div>
                            ) : (
                                (comments[currentItem.id] || []).map(comment => (
                                    <div key={comment.id} style={{
                                        display: 'flex',
                                        gap: '12px',
                                        padding: '15px 0',
                                        borderBottom: '1px solid #f8f9fa'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: comment.isTemporary ? '#ccc' : `linear-gradient(45deg, #667eea, #764ba2)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            flexShrink: 0
                                        }}>
                                            {comment.avatar}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '5px'
                                            }}>
                                                <span style={{
                                                    fontWeight: 'bold',
                                                    fontSize: '14px',
                                                    color: '#333'
                                                }}>
                                                    {comment.username}
                                                </span>
                                                <span style={{
                                                    fontSize: '12px',
                                                    color: '#999'
                                                }}>
                                                    {comment.timeAgo}
                                                    {comment.isTemporary && ' (저장중...)'}
                                                </span>
                                            </div>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '14px',
                                                lineHeight: '1.5',
                                                color: '#555',
                                                wordBreak: 'break-word'
                                            }}>
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* 댓글 작성 영역 */}
                        <div style={{
                            padding: '20px',
                            borderTop: '1px solid #eee',
                            background: '#fafafa',
                            flexShrink: 0
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="닉네임"
                                    style={{
                                        width: '100%',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        fontSize: '14px',
                                        background: 'white',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="작품에 대한 감상을 남겨주세요..."
                                    style={{
                                        width: '100%',
                                        minHeight: '80px',
                                        maxHeight: '120px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        resize: 'vertical',
                                        fontSize: '14px',
                                        background: 'white',
                                        boxSizing: 'border-box',
                                        fontFamily: 'inherit'
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && e.ctrlKey) {
                                            handleAddComment();
                                        }
                                    }}
                                />
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '12px',
                                        color: '#999'
                                    }}>
                                        💾 실시간 저장 (Ctrl+Enter: 빠른 등록)
                                    </p>
                                    <button
                                        onClick={handleAddComment}
                                        style={{
                                            background: newComment.trim() ? '#007bff' : '#ccc',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '10px 20px',
                                            fontSize: '14px',
                                            cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                                            fontWeight: 'bold',
                                            transition: 'background 0.2s ease'
                                        }}
                                        disabled={!newComment.trim()}
                                    >
                                        등록
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 스피너 애니메이션 CSS + 반응형 CSS */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* 데스크톱 (1024px 이상): 댓글 사이드바 표시, 아이콘 숨김 */
                @media (min-width: 1024px) {
                    .comment-sidebar-desktop {
                        display: block !important;
                    }
                    .comment-icon-mobile {
                        display: none !important;
                    }
                }

                /* 태블릿/모바일 (1024px 미만): 댓글 아이콘 표시, 사이드바 숨김 */
                @media (max-width: 1023px) {
                    .comment-sidebar-desktop {
                        display: none !important;
                    }
                    .comment-icon-mobile {
                        display: flex !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default InquiryForm2;