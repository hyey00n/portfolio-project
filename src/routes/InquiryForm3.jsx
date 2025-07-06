import React, { useState } from 'react';

function InstantLotteryFeed() {
    // SNS 스타일 피드 데이터
    const feedData = [
        {
            id: 1,
            profileImage: "../static/images/profile-01.jpg",
            username: "디자인러버",
            timeAgo: "2시간 전",
            content: "명함 이뻐요",
            likes: 24,
            comments: 8,
            isLiked: false
        },
        {
            id: 2,
            profileImage: "../static/images/profile-02.jpg",
            username: "크리에이터김",
            timeAgo: "3시간 전",
            content: "이 디자인 어떻게 한 건가요? 정말 깔끔하고 세련된 것 같아요. 컬러 조합도 너무 좋네요!",
            likes: 42,
            comments: 15,
            isLiked: true
        },
        {
            id: 3,
            profileImage: "../static/images/profile-03.jpg",
            username: "비즈니스맨박",
            timeAgo: "5시간 전",
            content: "어떻게 작업한지 문의드려도 될까요?",
            likes: 18,
            comments: 5,
            isLiked: false
        },
        {
            id: 4,
            profileImage: "../static/images/profile-04.jpg",
            username: "마케팅전문가",
            timeAgo: "6시간 전",
            content: "브랜딩 작업 정말 감각적이네요! 우리 회사도 이런 스타일로 리뉴얼하고 싶어요.",
            likes: 67,
            comments: 23,
            isLiked: true
        },
        {
            id: 5,
            profileImage: "../static/images/profile-05.jpg",
            username: "스타트업CEO",
            timeAgo: "8시간 전",
            content: "포트폴리오 보고 연락드렸는데 답변이 없으시네요 ㅠㅠ",
            likes: 12,
            comments: 3,
            isLiked: false
        },
        {
            id: 6,
            profileImage: "../static/images/profile-06.jpg",
            username: "프리랜서이",
            timeAgo: "1일 전",
            content: "클라이언트분들 반응이 너무 좋았어요! 덕분에 추가 작업도 의뢰받았습니다. 감사합니다!",
            likes: 89,
            comments: 31,
            isLiked: true
        }
    ];

    const [feeds, setFeeds] = useState(feedData);
    const [newPost, setNewPost] = useState('');

    const handleLike = (feedId) => {
        setFeeds(feeds.map(feed => {
            if (feed.id === feedId) {
                return {
                    ...feed,
                    likes: feed.isLiked ? feed.likes - 1 : feed.likes + 1,
                    isLiked: !feed.isLiked
                };
            }
            return feed;
        }));
    };

    const handleNewPost = () => {
        if (!newPost.trim()) return;

        const newFeed = {
            id: feeds.length + 1,
            profileImage: "../static/images/profile-me.jpg",
            username: "나",
            timeAgo: "방금 전",
            content: newPost,
            likes: 0,
            comments: 0,
            isLiked: false
        };

        setFeeds([newFeed, ...feeds]);
        setNewPost('');
    };

    return (
        <>
            <h2 className="h3-title">즉석 추첨형</h2>

            {/* 새 게시물 작성 */}
            <section className="shadowBox3" style={{ marginBottom: '20px' }}>
                <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            color: '#666'
                        }}>
                            👤
                        </div>
                        <div style={{ flex: 1 }}>
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="무엇이든 물어보세요..."
                                style={{
                                    width: '100%',
                                    minHeight: '80px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    resize: 'vertical',
                                    fontSize: '14px'
                                }}
                            />
                            <div style={{ marginTop: '10px', textAlign: 'right' }}>
                                <button
                                    onClick={handleNewPost}
                                    className="btnXl btnMainColor1"
                                    style={{ padding: '8px 20px' }}
                                >
                                    게시하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 피드 목록 */}
            <section className="feed-container">
                {feeds.map(feed => (
                    <div key={feed.id} className="shadowBox3" style={{ marginBottom: '20px' }}>
                        <div style={{ padding: '20px' }}>
                            {/* 프로필 헤더 */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '15px'
                            }}>
                                <div style={{
                                    width: '45px',
                                    height: '45px',
                                    borderRadius: '50%',
                                    background: `linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}>
                                    {feed.username.charAt(0)}
                                </div>
                                <div>
                                    <h4 style={{
                                        margin: 0,
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: '#333'
                                    }}>
                                        {feed.username}
                                    </h4>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '13px',
                                        color: '#999'
                                    }}>
                                        {feed.timeAgo}
                                    </p>
                                </div>
                            </div>

                            {/* 게시물 내용 */}
                            <div style={{
                                marginBottom: '15px',
                                lineHeight: '1.5',
                                fontSize: '15px',
                                color: '#333'
                            }}>
                                {feed.content}
                            </div>

                            {/* 상호작용 버튼 */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                paddingTop: '15px',
                                borderTop: '1px solid #f0f0f0'
                            }}>
                                <button
                                    onClick={() => handleLike(feed.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: feed.isLiked ? '#e74c3c' : '#666',
                                        fontSize: '14px',
                                        padding: '5px 10px',
                                        borderRadius: '20px',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <span style={{ fontSize: '16px' }}>
                                        {feed.isLiked ? '❤️' : '🤍'}
                                    </span>
                                    <span>{feed.likes}</span>
                                </button>

                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#666',
                                    fontSize: '14px',
                                    padding: '5px 10px',
                                    borderRadius: '20px',
                                    transition: 'background-color 0.2s'
                                }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <span style={{ fontSize: '16px' }}>💬</span>
                                    <span>{feed.comments}</span>
                                </button>

                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#666',
                                    fontSize: '14px',
                                    padding: '5px 10px',
                                    borderRadius: '20px',
                                    transition: 'background-color 0.2s'
                                }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <span style={{ fontSize: '16px' }}>📤</span>
                                    <span>공유</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* 더보기 버튼 */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button className="btnXl btnMainColor1">
                    더 많은 게시물 보기
                </button>
            </div>
        </>
    );
}

export default InstantLotteryFeed;