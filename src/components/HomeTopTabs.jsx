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
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveMenu(item.id);
                            }}
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>

            <style jsx>{`
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
                
                .home-mobile-tabs li a{
                    display: block;
                    padding: 12px 20px;
                    //background: #f8f9fa;
                    color: #666;
                    text-decoration: none;
                    border-radius: 25px;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    //border: 1px solid #e9ecef;
                }
                


                .home-mobile-tabs li.active a
                { 
                    color: var(--mainColor1);
                    font-weight: 800;}
                
                .home-mobile-tabs li:not(.active) a:hover {
                    background: #e9ecef;
                    color: #333;
                }
                
                /* 스크롤바 스타일링 */
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
            `}</style>
        </div>
    );
}

export default HomeTopTabs;