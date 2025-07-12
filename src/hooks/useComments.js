import { useState, useCallback } from 'react';

export function useComments() {
    const [comments, setComments] = useState({});
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    const fetchCommentsFromDB = async (projectId) => {
        try {
            console.log(`프로젝트 ${projectId} 댓글 로딩 시작...`);
            const response = await fetch(`http://localhost:3001/api/comments/${projectId}`);

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
                return [];
            }
        } catch (error) {
            console.error('댓글 불러오기 오류:', error);
            return [];
        }
    };

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
                if (result.success && result.data) {
                    return result.data;
                }
            }
            return null;
        } catch (error) {
            console.error('댓글 추가 오류:', error);
            return null;
        }
    };

    const getCommentsForItem = useCallback(async (itemId) => {
        setIsLoadingComments(true);
        try {
            const dbComments = await fetchCommentsFromDB(itemId);
            setComments(prev => ({
                ...prev,
                [itemId]: dbComments
            }));
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

    const addComment = async (itemId, username, content) => {
        if (!content.trim()) return;

        const tempId = `temp_${Date.now()}`;
        const tempComment = {
            id: tempId,
            username: username.trim(),
            timeAgo: '방금 전',
            content: content.trim(),
            avatar: username.trim().substring(0, 1),
            isTemporary: true
        };

        const currentComments = comments[itemId] || [];
        setComments(prev => ({
            ...prev,
            [itemId]: [tempComment, ...currentComments]
        }));

        try {
            const dbComment = await addCommentToDB(itemId, username.trim(), content.trim());

            if (dbComment) {
                setComments(prev => ({
                    ...prev,
                    [itemId]: prev[itemId].map(comment =>
                        comment.id === tempId ? {
                            ...dbComment,
                            avatar: dbComment.username?.substring(0, 1) || dbComment.avatar
                        } : comment
                    )
                }));
                return true;
            } else {
                setComments(prev => ({
                    ...prev,
                    [itemId]: prev[itemId].filter(comment => comment.id !== tempId)
                }));
                return false;
            }
        } catch (error) {
            console.error('댓글 추가 실패:', error);
            setComments(prev => ({
                ...prev,
                [itemId]: prev[itemId].filter(comment => comment.id !== tempId)
            }));
            return false;
        }
    };

    const refreshComments = (itemId) => {
        setComments(prev => {
            const updated = { ...prev };
            delete updated[itemId];
            return updated;
        });
        getCommentsForItem(itemId);
    };

    return {
        comments,
        isLoadingComments,
        getCommentsForItem,
        addComment,
        refreshComments
    };
}