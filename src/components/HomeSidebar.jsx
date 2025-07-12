import React from 'react';

function HomeSidebar({ activeMenu, setActiveMenu }) {
    const menuItems = [
        { id: 'notice', label: '디자이너알기' },
        { id: 'faq', label: '자주하는 질문' },
        { id: 'inquiry', label: '문의하기' }
    ];

    return (
        <div className="my-lnb-sidebar">
            <dl className="user-greeting">
                <dt>포트폴리오 FAQ</dt>
                <dd>궁금한 것을 찾아보세요</dd>
            </dl>
            <div className="code-customer-menu">
                {menuItems.map(item => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={activeMenu === item.id ? 'active' : ''}
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveMenu(item.id);
                        }}
                    >
                        <i></i>{item.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

export default HomeSidebar;