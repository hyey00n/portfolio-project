import '../styles/style.css';
import '../styles/popup.css';
import '../styles/webfont.css';
import '../styles/info_style.css';
import '../styles/common.css';



function Footer() {
  return (
     <>

             <footer id="footer">
                 <div className="inner">
                     <dl className="customer-service-center">
                         <dt className="ico"></dt>
                         <dl className="cs-center">
                             <span className="tel">070-000-0000</span>
                             <span
                                 className="info"><em>평일 : 10:00 ~ 18:00</em> <em>(점심 13:00 ~ 14:00, 주말&공휴일 제외)</em></span>
                         </dl>
                     </dl>
                     <ul className="address">
                         <li><span>주식회사 플래닛31</span><span>대표 : 이소정</span></li>
                         <li>주소 : 경기도 용인시 기흥구 동백중앙로 191, 8층 B8290호</li>
                         <li className="br"><span>사업자등록번호 : 578-87-02633 </span><span>통신판매업신고 : 제 2023-용인기흥-2660호</span>
                         </li>
                         <li> 관광사업등록번호 : 제 2023-000005</li>
                         <li><span>정보책임자 : 강상민</span> <span> Email : Info.planet31@gmail.com</span></li>
                     </ul>
                 </div>
             </footer>

     </>


  )
}


export default Footer;