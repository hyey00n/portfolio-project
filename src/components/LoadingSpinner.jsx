import React from 'react';

function LoadingSpinner({ message = "로딩 중..." }) {
    return (
        <div className="outer-layout-bg">
            <div className="mypage-2col-container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <p>{message}</p>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            border: '3px solid #f3f3f3',
                            borderTop: '3px solid #007bff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '20px auto'
                        }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadingSpinner;