import React, { useState } from 'react';

function CommentModal({ currentItem, comments, onClose, onAddComment, onRefreshComments, isLoadingComments }) {
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState('익명사용자');

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const success = await onAddComment(currentItem.id, username, newComment);
        if (success) {
            setNewComment('');
        } else {
            alert('댓글 등록에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
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
        }} onClick={onClose}>
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
                </div>

                {/* 작품 미리보기 */}
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
                            <h4 style={{
                                margin: 0, fontSize: '16px', fontWeight: 'bold',
                                color: '#333', marginBottom: '4px'
                            }}>
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
                            <div style={{
                                width: '40px', height: '40px', border: '3px solid #f3f3f3',
                                borderTop: '3px solid #007bff', borderRadius: '50%',
                                animation: 'spin 1s linear infinite', margin: '0 auto 20px'
                            }}></div>
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

                {/* 댓글 작성 */}
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
    );
}

export default CommentModal;