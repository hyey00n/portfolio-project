import React from 'react';

function GalleryTopTabs({ activeFilter, onFilterClick, getCategoryCount }) {
    const categories = [
        { key: '웹디자인', label: '웹디자인' },
        { key: 'UX/UI디자인', label: 'UX/UI' },
        { key: '소형홍보물', label: '소형물' },
        { key: '대형홍보물', label: '대형물' }
    ];

    return (
        <div className="mobile-tab-container">
            <ul className="tab-style-round gallery-mobile-tabs">
                {categories.map(category => (
                    <li key={category.key} className={activeFilter === category.key ? 'active' : ''}>
                        <a
                            href={`#${category.key}`}
                            onClick={(e) => {
                                e.preventDefault();
                                onFilterClick(category.key);
                            }}
                        >
                            {category.label}
                            <span className="count-badge">
                                {getCategoryCount(category.key)}
                            </span>
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
                
                .gallery-mobile-tabs {
                    display: flex;
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    gap: 10px;
                    min-width: max-content;
                    padding: 0 10px;
                }
                
                .gallery-mobile-tabs li {
                    flex-shrink: 0;
                }
                
                .gallery-mobile-tabs li a {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
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
                
                .gallery-mobile-tabs li.active a {
                    color: var(--mainColor1);
                    font-weight: 800;
                }
                
                .gallery-mobile-tabs li:not(.active) a:hover {
                    background: #e9ecef;
                    color: #333;
                }
                
                .count-badge {
                    background: #ff6b35;
                    color: white;
                    border-radius: 10px;
                    padding: 2px 6px;
                    font-size: 12px;
                    font-weight: bold;
                    min-width: 18px;
                    text-align: center;
                }
                
                .gallery-mobile-tabs li.active .count-badge {
                    background: rgba(255, 255, 255, 0.3);
                    color: white;
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

export default GalleryTopTabs;