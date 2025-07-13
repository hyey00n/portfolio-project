import React from 'react';

function Sidebar({ activeFilter, onFilterClick, getCategoryCount }) {
    const categories = [
        { key: '웹디자인', label: '웹디자인' },
        { key: 'UX/UI디자인', label: 'UX/UI디자인' },
        { key: '소형홍보물', label: '소형홍보물' },
        { key: '대형홍보물', label: '대형홍보물' }
    ];

    return (
        <div className="my-lnb-sidebar">
            <dl className="user-greeting">
                <dt>포트폴리오 갤러리</dt>
                <dd>다양한 작품을 만나보세요</dd>
            </dl>
            <div className="code-customer-menu">
                {categories.map(category => (
                    <a
                        key={category.key}
                        href=""
                        className={activeFilter === category.key ? 'active' : ''}
                        onClick={(e) => {
                            e.preventDefault();
                            onFilterClick(category.key);
                        }}
                    >
                        <i></i>{category.label}
                        <span style={{
                            background: 'var(--mainColor1)',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '2px 6px',
                            fontSize: '12px',
                            marginLeft: '5px'
                        }}>
                            {getCategoryCount(category.key)}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;