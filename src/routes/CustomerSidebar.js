import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios'
import '../styles/style.css';
import '../styles/popup.css';
import '../styles/webfont.css';
import '../styles/info_style.css';
import '../styles/common.css';



function CustomerSidebar(props) {
  return (
 <>

    <div class="outer-layout-bg">
     <div class="mypage-2col-container">

         <div class="my-lnb-sidebar">
             <dl class="user-greeting">
                 <dt>꿀부업 고객센타 </dt>
                 <dd>무엇이든지 물어보세요</dd>
             </dl>
             <div class="code-customer-menu">
                 <a href="" class="active"><i></i>공지사항</a>
                 <a href=""><i></i>자주하는 질문</a>
                 <a href=""><i></i>1:1문의</a>
             </div>
         </div>

         <div class="my-main-content  ">
             <h2 class="h3-title">1:1 문의하기</h2>

             <section class="shadowBox3">
                 <ul className="my-head-notice">
                     <li className="pos-left">
                         <ul className="tab-style-round">
                             <li className="active"><a href="">1:1문의하기 </a></li>
                             <li><a href="">문의확인리스트</a></li>
                         </ul>
                     </li>
                 </ul>
             </section>


             <section class="sec-customer">
                 <ul className="panel-input-col mt30">
                     <div class="flex">
                         <li className="row-item ">
                             <span class="subject">문의유형</span>
                             <div class="conbox col-3">
                                 <div class="select-default left">
                                     <select name="문의유형" id="email">
                                         <option value="0" selected>전체</option>
                                         <option value="title-1">이용안내</option>
                                         <option value="title-1">캠페인 지원</option>
                                         <option value="title-1">캠페인 참여</option>
                                         <option value="title-1">캠페인 취소</option>
                                         <option value="title-1">오류장애</option>
                                         <option value="title-1">등급제</option>
                                         <option value="title-1">포인트</option>
                                         <option value="title-1">쿠폰</option>
                                         <option value="title-1">개인정보</option>
                                         <option value="title-1">꿀부업 제품</option>
                                         <option value="title-1">기타</option>
                                     </select>
                                 </div>


                             </div>
                         </li>
                         <li className="row-item ">
                             <span class="subject">제목</span>
                             <div class="conbox left">
                                 <input type="text" name="name" id="name" value="" placeholder=""/>
                             </div>
                         </li>
                     </div>
                 </ul>
                 <ul className="panel-input-col mt30">
                     <li className="row-item">
                         <span class="subject">내용 작성</span>
                         <textarea type="text" placeholder="내용을 작성 해주세요"></textarea>
                     </li>
                     <li className="row-item filebox">
                         <span class="subject">첨부파일</span>
                         <label for="file">
                             <div class="btn-upload">파일 업로드하기</div>
                         </label>
                         <input type="file" name="file" id="file"/>
                     </li>
                 </ul>
                 <ul className="auto-id-save auto-center">
                     <li className="auto-center">
                         <input type="checkbox" id="autologin" name="auto"/>
                         <label for="autologin" class="checkBox"><span></span><em class="txt">위 내용에 동의합니다</em></label>
                     </li>
                 </ul>
                 <div class="bwhalf mt40">
                     <button type="button" class="btnXl btnMainColor1">제줄하기</button>
                 </div>


             </section>
         </div>


     </div>
 </div>

 </>
  )
}

export default CustomerSidebar;
