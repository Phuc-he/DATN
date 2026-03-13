import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBooksByCategory } from "../../../services/bookService";
import { getDetailCategory } from "../../../services/categoryService";
import { paginate } from "../../../utils/paginate";
import { Row } from "antd";
import Paginate from "../../../components/Paginate";
import BookItem from "../../../components/TopBook/BookItem";

function Category () {
    const { id } = useParams(); 
    const [data, setData] = useState([]);
    const [category, setCategory] = useState({})
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await getBooksByCategory(id);
                setData(result.content);

                const record = await getDetailCategory(id);
                setCategory(record);
            } catch (error) {
                console.error("Error fetching:", error);
            }
        };

        fetchApi();
    }, [id]);

    const pagination = paginate(data, currentPage, 6);

    return (
        <>
            <h1>{category.name}</h1>
            <Row gutter={[20, 20]}>
                <BookItem pagination={pagination}/>
            </Row>
            <Paginate pagination={pagination} setCurrentPage={setCurrentPage}/>
        </>
    )
}

export default Category