// components/GnbHeader.js
import React, { useState } from 'react';

function GnbHeader({ activeTab, onTabClick }) {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);


  return (
      <>
        <div id="header">
          {/* 광고 영역 */}
          <section className="sec-head-content">
            <p className="top-fix-ad"><i></i>포트폴리오 갤러리에 오신 것을 환영합니다!</p>
          </section>

          <section className="sec-gnb-wrap gnb-scroll-fix">
            <ul className="hd-gnb-wrap">

            </ul>

            {/* 네비 메뉴 */}
            <ul className="hd-nav-wrap">
              <li className="nav-menu-list">
                <a
                    href="#"
                    className={activeTab === '홈' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); onTabClick('홈'); }}
                >
                  홈
                </a>
                <a
                    href="#"
                    className={activeTab === '추첨형' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); onTabClick('추첨형'); }}
                >
                  갤러리
                </a>
              </li>
            </ul>
          </section>
        </div>

        {/* 디자이너 알기 모달 */}
        {isAboutModalOpen && (
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
            }} onClick={closeAboutModal}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '80%',
                padding: '0',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }} onClick={(e) => e.stopPropagation()}>
                {/* 모달 헤더 */}
                <div style={{
                  padding: '20px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <button
                      onClick={closeAboutModal}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#ccc',
                        lineHeight: 1
                      }}
                  >
                    ×
                  </button>
                </div>

                {/* 모달 내용 */}
                <div style={{
                  padding: '30px',
                  maxHeight: 'calc(80vh - 100px)',
                  overflowY: 'auto'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '30px' }}>

                    <h4 style={{ fontSize: '24px', marginBottom: '15px', color: '#333' }}>
                      문제를 즐기는 디자이너, 정혜윤입니다
                    </h4>
                  </div>

                  <div style={{
                    background: '#f8f9fa',
                    padding: '25px',
                    borderRadius: '12px',
                    marginBottom: '25px',
                    lineHeight: '1.8'
                  }}>
                    <p style={{ margin: '0 0 15px 0', color: '#555', fontSize: '16px' }}>
                      저의 포트폴리오 방문을 진심으로 환영합니다. 이곳에서는
                      <strong style={{ color: '#667eea' }}> 그래픽 및 웹디자인 작품</strong>을 동시에 볼 수 있습니다.
                    </p>
                    <p style={{ margin: '0 0 15px 0', color: '#555', fontSize: '16px' }}>
                      문제를 마주하고 함께 해결하는 과정을 통해 늘 단기적이고 작은 목표라도
                      구체적인 계획을 가진 디자이너로 성장하고 있습니다.
                    </p>
                    <p style={{ margin: '0 0 15px 0', color: '#555', fontSize: '16px' }}>
                      경험을 통해 업체의 방향성을 중요하게 생각하며, 효율적으로 업무 목표를
                      이루기 위해 최선을 다하겠다는 다짐을 합니다.
                    </p>
                    <p style={{ margin: 0, color: '#555', fontSize: '16px' }}>
                      제 디자이너로서의 포부는 업체와의 신뢰를 유지하고, 목표를 달성하기 위해
                      협력하고 <strong style={{ color: '#764ba2' }}>효율적인 커뮤니케이션</strong>을 강조하는 것입니다.
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '25px'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                      padding: '20px',
                      borderRadius: '10px',
                      color: 'white',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎯</div>
                      <h5 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>전문 분야</h5>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        웹디자인 & 그래픽디자인
                      </p>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #4834d4 0%, #686de0 100%)',
                      padding: '20px',
                      borderRadius: '10px',
                      color: 'white',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>💡</div>
                      <h5 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>핵심 가치</h5>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        문제 해결 & 효율적 소통
                      </p>
                    </div>
                  </div>


                </div>
              </div>
            </div>
        )}

        {/* 경력사항 모달 */}
        {isCareerModalOpen && (
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
            }} onClick={closeCareerModal}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '700px',
                maxHeight: '85%',
                padding: '0',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }} onClick={(e) => e.stopPropagation()}>
                {/* 모달 헤더 */}
                <div style={{
                  padding: '20px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <button
                      onClick={closeCareerModal}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#ccc',
                        lineHeight: 1
                      }}
                  >
                    ×
                  </button>
                </div>

                {/* 모달 내용 */}
                <div style={{
                  padding: '30px',
                  maxHeight: 'calc(85vh - 100px)',
                  overflowY: 'auto'
                }}>

                  {/* 경력사항 */}
                  <div style={{ marginBottom: '40px' }}>
                    <h4 style={{
                      fontSize: '20px',
                      marginBottom: '25px',
                      color: '#2c3e50',
                      borderBottom: '2px solid #3498db',
                      paddingBottom: '10px'
                    }}>
                      📈 주요 경력사항
                    </h4>

                    {/* 피치스소프트 */}
                    <div style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '10px',
                      padding: '20px',
                      marginBottom: '20px',
                      background: '#fff'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                          <h5 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#2c3e50' }}>피치스소프트</h5>
                          <p style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>디자인팀 사원</p>
                        </div>
                        <span style={{
                          background: '#3498db',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          2023.10 ~ 2023.12
                        </span>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                        <li style={{ marginBottom: '5px', color: '#555' }}>• 리워드앱, 영상채팅 스크린샷 제작</li>
                        <li style={{ marginBottom: '5px', color: '#555' }}>• 리워드앱 웹/모바일 반응형 UX/UI 디자인</li>
                        <li style={{ color: '#555' }}>• 리워드앱 웹/모바일 퍼블리싱</li>
                      </ul>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {['Photoshop', 'Illustrator', 'HTML & CSS', 'jQuery', 'Figma'].map((skill, index) => (
                            <span key={index} style={{
                              background: '#ecf0f1',
                              color: '#2c3e50',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '11px'
                            }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 해월동 복합문화센터 */}
                    <div style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '10px',
                      padding: '20px',
                      marginBottom: '20px',
                      background: '#fff'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                          <h5 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#2c3e50' }}>해월동 복합문화센터</h5>
                          <p style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>디자인팀 사원</p>
                        </div>
                        <span style={{
                          background: '#e74c3c',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          2022.11 ~ 2023.10
                        </span>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                        <li style={{ marginBottom: '5px', color: '#555' }}>• 향수라벨지 및 디자인</li>
                        <li style={{ color: '#555' }}>• 해월동프랜트월 홈페이지 제작</li>
                      </ul>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {['Photoshop', 'Illustrator', 'HTML', 'CSS'].map((skill, index) => (
                            <span key={index} style={{
                              background: '#ecf0f1',
                              color: '#2c3e50',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '11px'
                            }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 아이피버스 */}
                    <div style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '10px',
                      padding: '20px',
                      marginBottom: '20px',
                      background: '#fff'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                          <h5 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#2c3e50' }}>아이피버스</h5>
                          <p style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>디자인팀 인턴</p>
                        </div>
                        <span style={{
                          background: '#9b59b6',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          2022.04 ~ 2022.07
                        </span>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                        <li style={{ marginBottom: '5px', color: '#555' }}>• PC 메인 페이지 디자인</li>
                        <li style={{ marginBottom: '5px', color: '#555' }}>• 앱 디자인 리뉴얼</li>
                        <li style={{ color: '#555' }}>• 개인정보처리방침 반응형 유지보수</li>
                      </ul>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {['Photoshop', 'Illustrator', 'HTML & CSS', 'jQuery', 'Figma'].map((skill, index) => (
                            <span key={index} style={{
                              background: '#ecf0f1',
                              color: '#2c3e50',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '11px'
                            }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 토마토애드 */}
                    <div style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '10px',
                      padding: '20px',
                      marginBottom: '20px',
                      background: '#fff'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                          <h5 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#2c3e50' }}>토마토애드</h5>
                          <p style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>디자인팀 사원</p>
                        </div>
                        <span style={{
                          background: '#f39c12',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          2015.11 ~ 2016.12
                        </span>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                        <li style={{ marginBottom: '5px', color: '#555' }}>• 어반웨딩스튜디오 팜플릿 디자인 및 발주</li>
                        <li style={{ marginBottom: '5px', color: '#555' }}>• 대구보건소 안내표지판 디자인</li>
                        <li style={{ color: '#555' }}>• 삼정그린코어 분양 카탈로그 및 광고</li>
                      </ul>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {['Photoshop', 'Illustrator', 'InDesign'].map((skill, index) => (
                            <span key={index} style={{
                              background: '#ecf0f1',
                              color: '#2c3e50',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '11px'
                            }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 자격증 */}
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{
                      fontSize: '20px',
                      marginBottom: '20px',
                      color: '#2c3e50',
                      borderBottom: '2px solid #27ae60',
                      paddingBottom: '10px'
                    }}>
                      🏆 보유 자격증
                    </h4>

                    <div style={{ display: 'grid', gap: '15px' }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '15px 20px',
                        borderRadius: '10px',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <h5 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>웹디자인기능사</h5>
                          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>한국산업인력공단</p>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>2021.04</span>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #ff7675 0%, #d63031 100%)',
                        padding: '15px 20px',
                        borderRadius: '10px',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <h5 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>컬러리스트산업기사</h5>
                          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>한국산업인력공단</p>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>2018.08</span>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
                        padding: '15px 20px',
                        borderRadius: '10px',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <h5 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>컴퓨터그래픽스운용기능사</h5>
                          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>한국산업인력공단</p>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>2014.06</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
        )}
      </>
  );
}

export default GnbHeader;