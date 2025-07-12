import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import GalleryTopTabs from '../components/GalleryTopTabs';
import PortfolioViewer from '../components/PortfolioViewer';
import CommentModal from '../components/CommentModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePortfolio } from '../hooks/usePortfolio';
import { useComments } from '../hooks/useComments';
import '../styles/style.css';
import '../styles/popup.css';
import '../styles/webfont.css';
import '../styles/info_style.css';
import '../styles/common.css';

function Gallery() {
    const [activeFilter, setActiveFilter] = useState('웹디자인');
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

    // 커스텀 훅 사용
    const { portfolioData, isLoadingPortfolio, fetchPortfolioData } = usePortfolio();
    const { comments, isLoadingComments, getCommentsForItem, addComment, refreshComments } = useComments();

    const handleFilterClick = (filterName) => {
        setActiveFilter(filterName);
        setCurrentItemIndex(0);
    };

    const getCurrentItems = () => {
        return portfolioData[activeFilter] || [];
    };

    const currentItems = getCurrentItems();
    const currentItem = currentItems[currentItemIndex];

    // 현재 아이템이 변경될 때마다 댓글 로드
    useEffect(() => {
        if (currentItem && !comments[currentItem.id]) {
            getCommentsForItem(currentItem.id);
        }
    }, [currentItem?.id, getCommentsForItem, comments]);

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

    const getCategoryCount = (category) => {
        return portfolioData[category]?.length || 0;
    };

    // 로딩 상태
    if (isLoadingPortfolio) {
        return <LoadingSpinner message="포트폴리오를 불러오는 중..." />;
    }

    // 데이터가 없는 경우
    if (!currentItems.length || !currentItem) {
        return (
            <div className="outer-layout-bg">
                <div className="mypage-2col-container">
                    {/* 데스크톱 사이드바 */}
                    <div className="desktop-sidebar">
                        <Sidebar
                            activeFilter={activeFilter}
                            onFilterClick={handleFilterClick}
                            getCategoryCount={getCategoryCount}
                        />
                    </div>

                    <div className="my-main-content">
                        {/* 모바일 상단 탭 */}
                        <div className="mobile-top-tabs">
                            <GalleryTopTabs
                                activeFilter={activeFilter}
                                onFilterClick={handleFilterClick}
                                getCategoryCount={getCategoryCount}
                            />
                        </div>

                        <h2 className="h3-title">포트폴리오 갤러리</h2>
                        <section className="shadowBox3">
                            <div style={{ padding: '50px', textAlign: 'center' }}>
                                <p>해당 카테고리에 작품이 없습니다.</p>
                                <button
                                    onClick={fetchPortfolioData}
                                    style={{
                                        marginTop: '10px',
                                        padding: '10px 20px',
                                        background: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    다시 불러오기
                                </button>
                            </div>
                        </section>
                    </div>
                </div>

                {/* 반응형 CSS */}
                <style jsx>{`
                    @media (min-width: 1024px) {
                        .desktop-sidebar { display: block; }
                        .mobile-top-tabs { display: none; }
                    }
                    @media (max-width: 1023px) {
                        .desktop-sidebar { display: none; }
                        .mobile-top-tabs { display: block; margin-bottom: 20px; }
                        .mypage-2col-container { display: block !important; }
                        .my-main-content { width: 100% !important; margin-left: 0 !important; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="outer-layout-bg">
            <div className="mypage-2col-container">
                {/* 데스크톱 사이드바 */}
                <div className="desktop-sidebar">
                    <Sidebar
                        activeFilter={activeFilter}
                        onFilterClick={handleFilterClick}
                        getCategoryCount={getCategoryCount}
                    />
                </div>

                {/* 메인 콘텐츠 */}
                <div className="my-main-content">
                    {/* 모바일 상단 탭 */}
                    <div className="mobile-top-tabs">
                        <GalleryTopTabs
                            activeFilter={activeFilter}
                            onFilterClick={handleFilterClick}
                            getCategoryCount={getCategoryCount}
                        />
                    </div>

                    <h2 className="h3-title">포트폴리오 갤러리</h2>

                    <PortfolioViewer
                        currentItem={currentItem}
                        currentItems={currentItems}
                        currentItemIndex={currentItemIndex}
                        onPrevItem={handlePrevItem}
                        onNextItem={handleNextItem}
                        onItemSelect={setCurrentItemIndex}
                        onOpenComments={() => setIsCommentModalOpen(true)}
                        comments={comments}
                        onAddComment={addComment}
                        isLoadingComments={isLoadingComments}
                    />
                </div>
            </div>

            {/* 댓글 모달 */}
            {isCommentModalOpen && (
                <CommentModal
                    currentItem={currentItem}
                    comments={comments}
                    onClose={() => setIsCommentModalOpen(false)}
                    onAddComment={addComment}
                    onRefreshComments={refreshComments}
                    isLoadingComments={isLoadingComments}
                />
            )}

            {/* 반응형 CSS */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* 데스크톱 (1024px 이상): 사이드바 표시, 상단 탭 숨김 */
                @media (min-width: 1024px) {
                    .desktop-sidebar {
                        display: block;
                    }
                    .mobile-top-tabs {
                        display: none;
                    }
                    .comment-sidebar-desktop {
                        display: block !important;
                    }
                    .comment-icon-mobile {
                        display: none !important;
                    }
                }

                /* 모바일/태블릿 (1024px 미만): 상단 탭 표시, 사이드바 숨김 */
                @media (max-width: 1023px) {
                    .desktop-sidebar {
                        display: none;
                    }
                    .mobile-top-tabs {
                        display: block;
                        margin-bottom: 20px;
                    }
                    .comment-sidebar-desktop {
                        display: none !important;
                    }
                    .comment-icon-mobile {
                        display: flex !important;
                    }

                    /* 모바일에서 mypage-2col-container 레이아웃 조정 */
                    .mypage-2col-container {
                        display: block !important;
                    }

                    .my-main-content {
                        width: 100% !important;
                        margin-left: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default Gallery;