import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormControl, InputGroup, Row, Spinner, Table } from 'react-bootstrap';
import Pagination from "react-js-pagination";
import { Link, useLocation, useNavigate } from 'react-router-dom';
 


const ShopList = () => {

    const navi=useNavigate();
    const location=useLocation();
    const [query,setQuery]=useState('메루루의');
    const search= new URLSearchParams(location.search);
    const [cnt,setCnt]=useState(0);
    const [list,setList]=useState([]);
    const [total,setTotal]=useState(0);
    const [loading,setLoading]=useState(false);

    const size=5;
    const page=search.get("page") ? parseInt(search.get("page")) :1;
  


    const getList=async()=>{

        setLoading(true);
        const res=await axios.get(`/shop/list.json?page=${page}&size=${size}&query=${query}`);
        const data=res.data.list.map(s=>s && {...s,title:stripHtmlTags(s.title), checked:false})
        setList(data); 
        setTotal(res.data.total)
        setLoading(false);
        console.log(data)
        console.log(data.total)
        
    }


 useEffect(()=>{
    let cnt=0;
    list.forEach(s=>
        s.checked && cnt++);
    setCnt(cnt);

 },[list])   

useEffect(()=>{
    getList();
},[location])

const onSubmit=(e)=>{
    e.preventDefault();
     
    navi(`/shop/list?page=1&size=${size}&query=${query}`);

}

const stripHtmlTags = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
  }

const onDelete=async(pid,image)=>{
    if(window.confirm(`${pid}번 상품을 삭제하실래요?`)){
        await axios(`/shop/delete?pid=${pid}`);
        await axios(`/deleteFile?file=${image}`);
        alert('삭제완료!');
        navi(`/shop/list?page=1&size=${size}&query=${query}`);
    }
}

if(loading){
    return(
        <div>
            
            <Spinner/> Now Loading ...
 
        </div>
    )
}

const onChangeAll=(e)=>{
 const data=list.map(s=>s && {...s, checked:e.target.checked});
 setList(data);

}

const onChangeSingle=(e,pid)=>{
    const data=list.map(s=>s.pid===pid ?{...s, checked:e.target.checked} :s);
    setList(data);
   
   }

//onChangeSingle=()=>{}

 
  return (
    <div className='my-5'>
        <h1 className='text-center mb-5' style={{color:"white"}}>상품 목록</h1>
        <hr style={{color:"white"}}/>
<Row>
    <Col md={3}>
    <Form onSubmit={onSubmit}>
        <InputGroup className='mb-2'>
               
        <FormControl onChange={(e)=>setQuery(e.target.value)}
        placeholder='상품명,브랜드' value={query}/>
        <Button variant='danger' type="submit">
            검색</Button>   <span style={{color:"white"}}>&nbsp; &nbsp; 상품수: {total}개 </span>
        </InputGroup>

        
        
    </Form>

    </Col>
    
    <Col className='text-end'>
   
     
        <Button 
        variant='danger btn-sm'> 선택 삭제</Button>
         
    
    </Col>

    
  
</Row>



        <Table striped bordered hover>
                <thead className='text-center'>
                    <tr>
                        <th><input checked={list.length===cnt} onChange={onChangeAll} type="checkbox"/></th>
                        <th>ID</th>
                        <th>이미지</th>
                        <th>상품명</th>
                        <th>상품가격</th>
                        <th>브랜드</th>
                        <th>등록일</th>
                        <th>조회수</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {list.map(s=>
                    <tr key={s.pid}>
                        <td><input type="checkbox" onChange={(e)=>onChangeSingle(e,s.pid)} checked={s.checked}
                        /></td>
                        <td>{s.pid}</td>
                        <td><img src={`/display?file=${s.image}`} width="100"/></td>
                        <td><Link to={`/shop/update/${s.pid}`}><div className='ellipsis'>{s.title}</div></Link></td>
                        <td>{s.fmtprice}</td>
                        <td>{s.maker}</td>
                        <td>{s.fmtdate}</td>
                        <td>{s.viewcnt}</td>
                        <td><Button onClick={()=>onDelete(s.pid,s.image)}
                        className='btn-sm' variant='danger'>삭제</Button></td>

                    </tr>
)}
                </tbody>
            </Table>

            <Pagination
 activePage={page}
 itemsCountPerPage={size}
 totalItemsCount={total}
 pageRangeDisplayed={10}
 prevPageText={"‹"}
 nextPageText={"›"}
 onChange={ (cpage)=>{navi(`/shop/list?page=${cpage}&size=${size}&query=${query}`)} }/>
 
        </div>
  )


}

export default ShopList
