import React from 'react';
import Footer from './routes/Footer';
import GnbHeader from './components/GnbHeader';
import InquiryForm from './routes/InquiryForm';
import MobileNav from './routes/MobileNav';



function App() {
    return (
        <>
            <GnbHeader></GnbHeader>
            <InquiryForm></InquiryForm>
            <Footer></Footer>
            <MobileNav></MobileNav>
        </>
    );
}



export default App;
