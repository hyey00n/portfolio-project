import React, { useState } from 'react';

function InquirySection() {
    console.log('🔥 InquirySection 컴포넌트가 렌더링됨!'); // 맨 위로 이동

    const [inquiryType, setInquiryType] = useState('0');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [agreed, setAgreed] = useState(false);

    const handleInquirySubmit = (e) => {
        e.preventDefault();

        if (!agreed) {
            alert('내용에 동의해주세요.');
            return;
        }
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        console.log({ inquiryType, title, content, file, agreed });
        alert('문의가 성공적으로 제출되었습니다.');

        // 폼 초기화
        setInquiryType('0');
        setTitle('');
        setContent('');
        setFile(null);
        setAgreed(false);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <>
            <h2 className="h3-title">1:1 문의하기</h2>
            <div>
                <section className="sec-customer">
                    <ul className="panel-input-col mt30">
                        <div className="flex">
                            <li className="row-item">
                                <span className="subject">문의유형</span>
                                <div className="conbox col-3">
                                    <div className="select-default left">
                                        <select
                                            name="inquiryType"
                                            id="inquiryType"
                                            value={inquiryType}
                                            onChange={(e) => setInquiryType(e.target.value)}
                                        >
                                            <option value="0">전체</option>
                                            <option value="portfolio">포트폴리오 관련</option>
                                            <option value="project">프로젝트 문의</option>
                                            <option value="collaboration">협업 제안</option>
                                            <option value="career">경력 문의</option>
                                            <option value="technical">기술 관련</option>
                                            <option value="etc">기타</option>
                                        </select>
                                    </div>
                                </div>
                            </li>
                            <li className="row-item">
                                <span className="subject">제목</span>
                                <div className="conbox left">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="제목을 입력해주세요"
                                    />
                                </div>
                            </li>
                        </div>
                    </ul>
                    <ul className="panel-input-col mt30">
                        <li className="row-item">
                            <span className="subject">내용 작성</span>
                            <textarea
                                name="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="내용을 작성해주세요"
                            />
                        </li>
                        <li className="row-item filebox">
                            <span className="subject">첨부파일</span>
                            <label htmlFor="file">
                                <div className="btn-upload">
                                    파일 업로드하기
                                    {file && <span> - {file.name}</span>}
                                </div>
                            </label>
                            <input
                                type="file"
                                name="file"
                                id="file"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </li>
                    </ul>
                    <ul className="auto-id-save auto-center">
                        <li className="auto-center">
                            <input
                                type="checkbox"
                                id="autologin"
                                name="auto"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                            />
                            <label htmlFor="autologin" className="checkBox">
                                <span></span>
                                <em className="txt">위 내용에 동의합니다</em>
                            </label>
                        </li>
                    </ul>
                    <div className="bwhalf mt40">
                        <button type="button" className="btnXl btnMainColor1" onClick={handleInquirySubmit}>
                            제출하기
                        </button>
                    </div>
                </section>

                <style>
                    {`
                    .panel-input-col.mt30 > .flex {
                        gap: 20px !important;
                    }
                    `}
                </style>
            </div>
        </>
    );
}

export default InquirySection;