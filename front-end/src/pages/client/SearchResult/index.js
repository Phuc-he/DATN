import { useSearchParams } from "react-router-dom";
import { findBooks } from "../../../services/bookService";
import { useEffect, useState } from "react";
import BookItem from "../../../components/TopBook/BookItem";
import { paginate } from "../../../utils/paginate";
import Paginate from "../../../components/Paginate";
import { Row } from "antd";

function SearchResult () {
  const [data, setData] = useState([]);
  const [ searchParams ] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [currentPage, setCurrentPage] = useState(1);

  console.log(keyword);
  
  useEffect(() => {
    const fetchApi = async () => {
      const result = await findBooks(keyword);
        setData(result.content)
    }
    fetchApi();
  }, [keyword]) 

  const pagination = paginate(data, currentPage, 3);

  return (
    <>
      {data.length > 0 ? (
        <>
          <h1>Kết quả tìm kiếm: {keyword}</h1>
          <Row gutter={[20, 20]}>
            <BookItem pagination={pagination}/>
          </Row>
          <Paginate pagination={pagination} setCurrentPage={setCurrentPage}/>
        </>
      ) : (
        <>
          <h1>Không tìm thấy kết quả</h1>
        </>
      )}
    </>
  )
}

export default SearchResult;