import React from 'react';

function HomeTopTabs({ activeMenu, setActiveMenu }) {
    const menuItems = [
        { id: 'notice', label: '디자이너알기' },
        { id: 'faq', label: '자주하는 질문' },
        { id: 'inquiry', label: '문의하기' }
    ];

    return (
        <div className="mobile-tab-container">
            <ul className="tab-style-round home-mobile-tabs">
                {menuItems.map(item => (
                    <li key={item.id} className={activeMenu === item.id ? 'active' : ''}>
                        <button
                            type="button"
                            onClick={() => setActiveMenu(item.id)}
                            style={{
                                display: 'block',
                                padding: '12px 20px',
                                color: activeMenu === item.id ? 'var(--mainColor1)' : '#666',
                                textDecoration: 'none',
                                borderRadius: '25px',
                                fontSize: '14px',
                                fontWeight: activeMenu === item.id ? '800' : '500',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                            onMouseEnter={(e) => {
                                if (activeMenu !== item.id) {
                                    e.target.style.background = '#e9ecef';
                                    e.target.style.color = '#333';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeMenu !== item.id) {
                                    e.target.style.background = 'none';
                                    e.target.style.color = '#666';
                                }
                            }}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>

            {/* jsx 속성 제거 */}
            <style>
                {`
                .mobile-tab-container {
                    width: 100%;
                    overflow-x: auto;
                    margin-bottom: 20px;
                }
                
                .home-mobile-tabs {
                    display: flex;
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    gap: 10px;
                    min-width: max-content;
                    padding: 0 10px;
                }
                
                .home-mobile-tabs li {
                    flex-shrink: 0;
                }
                
                .mobile-tab-container::-webkit-scrollbar {
                    height: 4px;
                }
                
                .mobile-tab-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 2px;
                }
                
                .mobile-tab-container::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 2px;
                }
                
                .mobile-tab-container::-webkit-scrollbar-thumb:hover {
                    background: #999;
                }
            `}
            </style>
        </div>
    );
}

export default HomeTopTabs;