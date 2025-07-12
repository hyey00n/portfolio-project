import React, { useState } from 'react';

function CommentSidebar({ currentItem, comments, onAddComment, isLoadingComments }) {
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
        <section className="shadowBox3" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                        <div key={comment.id} style={{
                            display: 'flex', gap: '12px', padding: '15px 0',
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
                                    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px'
                                }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                                        {comment.username}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#999' }}>
                                        {comment.timeAgo}
                                        {comment.isTemporary && ' (저장중...)'}
                                    </span>
                                </div>
                                <p style={{
                                    margin: 0, fontSize: '14px', lineHeight: '1.5',
                                    color: '#555', wordBreak: 'break-word'
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
                padding: '20px', borderTop: '1px solid #eee',
                background: '#fafafa', flexShrink: 0
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="닉네임"
                        style={{
                            width: '100%', border: '1px solid #ddd', borderRadius: '6px',
                            padding: '8px', fontSize: '14px', background: 'white', boxSizing: 'border-box'
                        }}
                    />
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="작품에 대한 감상을 남겨주세요..."
                        style={{
                            width: '100%', minHeight: '60px', maxHeight: '120px',
                            border: '1px solid #ddd', borderRadius: '8px', padding: '12px',
                            resize: 'vertical', fontSize: '14px', background: 'white', boxSizing: 'border-box'
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                                handleAddComment();
                            }
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
    );
}

export default CommentSidebar;