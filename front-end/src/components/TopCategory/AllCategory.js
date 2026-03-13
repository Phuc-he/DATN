import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import CategoryItem from "./CategoryItem";
import { Col, Row } from "antd";
import { paginate } from "../../utils/paginate";
import Paginate from "../Paginate";
import { Outlet } from "react-router-dom";

function AllCategory () {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchApi = async () => {
            const result = await getCategories();
            setData(result.content);
        }

        fetchApi();
    }, []);

    const pagination = paginate(data, currentPage, 2);

    return (
        <>
            <Outlet/>
            <h2>Khám phá thể loại</h2>
            <Row gutter={[30, 30]}>
                {pagination.currentItems && (
                    pagination.currentItems.map(item => (
                        <Col span={12}>
                            <CategoryItem item={item}/>
                        </Col>
                    ))
                )}
            </Row>

            <Paginate pagination={pagination} setCurrentPage={setCurrentPage}/>
        </>
    )
}

export default AllCategory;