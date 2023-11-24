import React, { useEffect } from 'react'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import SearchPage from './shop/SearchPage';
import ShopList from './shop/ShopList';
import ShopUpdate from './shop/ShopUpdate';
import {delCookie, getCookie} from "../common.js"
import Login from './user/Login';


const NaviPage = () => {
    const location=useLocation();
    const path=location.pathname;
    const onLogout=(e)=>{
        e.preventDefault();
        if(window.confirm('로그아웃 하실래요?')){
            sessionStorage.clear();
            delCookie("uid");
            window.location.href="/";
        }
    }


    useEffect(()=>{
        const uid=getCookie("uid");
        const upass=getCookie("upass");
        console.log('...................',uid);
        console.log('...................',upass);

        sessionStorage.setItem("uid",uid);
        sessionStorage.setItem("upass",upass);
    },[location])

    return (
        <div>
            <hr style={{ color: "red", borderWidth: '5px' }} />
            <Navbar data-bs-theme="dark" bg="black">
                <Container>
                    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#home" >Home</Nav.Link>
                        <Nav.Link href="/shop/search" className="{path.indexOf('/shop/search')!==-1 &&'active'}">상품검색</Nav.Link>
                        <Nav.Link href="/shop/list" className="{path.indexOf('/shop/list')!==-1 &&'active'}">상품목록</Nav.Link>
                    </Nav>
                    <Nav>
                        {!sessionStorage.getItem("uid") ?
                            <>
                                <Nav.Link href="/login" className="{path.indexOf('/login')!==-1 &&'active'}">로그인</Nav.Link>
                                
                                <Nav.Link href="#home">회원가입</Nav.Link>
                            </>
                            :
                            <>
                                <Nav.Link href="/user/mypage" className="{path.indexOf('/mypage')!==-1 &&'active'}">{sessionStorage.getItem("uid")}</Nav.Link>
                                <Nav.Link href="/logout" onClick={onLogout}
                                className="{path.indexOf('/logout')!==-1 &&'active'}">로그아웃</Nav.Link>
                            </>
                        }
                    </Nav>
                </Container>
            </Navbar>
            <hr style={{ color: "red", borderWidth: '5px' }} />

            <Routes>
                <Route path="/shop/search" element={<SearchPage />} />
                <Route path="/shop/list" element={<ShopList />} />
                <Route path="/shop/update/:pid" element={<ShopUpdate />} />
                <Route path="/login" element={<Login />} />


            </Routes>




        </div>
    )
}

export default NaviPage
