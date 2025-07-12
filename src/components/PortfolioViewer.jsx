import React from 'react';
import CommentSidebar from './CommentSidebar';

function PortfolioViewer({
                             currentItem,
                             currentItems,
                             currentItemIndex,
                             onPrevItem,
                             onNextItem,
                             onItemSelect,
                             onOpenComments,
                             comments,
                             onAddComment,
                             isLoadingComments
                         }) {
    return (
        <div style={{ display: 'flex', gap: '20px', height: '75vh' }}>
            {/* 작품 뷰어 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <section className="shadowBox3" style={{ flex: 1, position: 'relative', width: '100%', overflow: 'hidden' }}>
                    <div className="swiper-slide" style={{ width: '100%', height: '100%', display: 'block' }}>
                        <a href={currentItem.url} target="_blank" rel="noopener noreferrer"
                           style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>

                            {/* 배지 */}
                            <div className="badge-group" style={{
                                position: 'absolute', top: '15px', left: '15px', right: '15px', zIndex: 5,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
                            }}>
                                <p className={`badge-pos-left ${currentItem.badge}`} style={{
                                    background: getBadgeColor(currentItem.badge),
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

                            {/* 이미지 */}
                            <div className="item-photo-box" style={{
                                height: '320px',
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

                            {/* 작품 정보 */}
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

                                {/* 제목 */}
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

                                {/* 설명 */}
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

                    {/* 네비게이션 버튼 */}
                    {currentItemIndex > 0 && (
                        <button onClick={onPrevItem} style={{
                            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%',
                            width: '45px', height: '45px', cursor: 'pointer', fontSize: '20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                        }}>‹</button>
                    )}
                    {currentItemIndex < currentItems.length - 1 && (
                        <button onClick={onNextItem} style={{
                            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%',
                            width: '45px', height: '45px', cursor: 'pointer', fontSize: '20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                        }}>›</button>
                    )}

                    {/* 모바일 댓글 아이콘 */}
                    <button
                        onClick={onOpenComments}
                        className="comment-icon-mobile"
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
                    >
                        💬
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
                    <div style={{
                        position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', gap: '8px', zIndex: 10
                    }}>
                        {currentItems.map((_, index) => (
                            <div
                                key={index}
                                style={{
                                    width: '10px', height: '10px', borderRadius: '50%',
                                    background: index === currentItemIndex ? '#007bff' : 'rgba(255,255,255,0.7)',
                                    cursor: 'pointer', border: '1px solid rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={() => onItemSelect(index)}
                            />
                        ))}
                    </div>
                </section>
            </div>

            {/* 데스크톱 댓글 사이드바 */}
            <div className="comment-sidebar-desktop" style={{ width: '350px', flexShrink: 0 }}>
                <CommentSidebar
                    currentItem={currentItem}
                    comments={comments}
                    onAddComment={onAddComment}
                    isLoadingComments={isLoadingComments}
                />
            </div>
        </div>
    );
}

// 배지 색상 함수
function getBadgeColor(badge) {
    const colors = {
        'bright-blue': '#007bff',
        'bright-green': '#28a745',
        'bright-purple': '#6f42c1',
        'bright-cyan': '#17a2b8',
        'bright-teal': '#20c997',
        'bright-indigo': '#6610f2',
        'bright-red': '#dc3545',
        'bright-orange': '#fd7e14',
        'bright-yellow': '#ffc107',
        'bright-pink': '#e83e8c',
        'bright-brown': '#6c5ce7'
    };
    return colors[badge] || '#6c757d';
}

export default PortfolioViewer;