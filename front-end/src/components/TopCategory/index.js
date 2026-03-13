import { Carousel, Col, Row } from "antd";
import "./TopCategory.scss";
import { Link } from "react-router-dom";
import { RightOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import CategoryItem from "./CategoryItem";

function TopCategory () {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const result = await getCategories();
            setData(result.content);
        }

        fetchApi();
    }, []);

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={20}>
                    <h1>Các danh mục xu hướng</h1>
                </Col>
                <Col span={4}>
                    <Link to="/categories">Khám phá ngay <RightOutlined /></Link>
                </Col>
            </Row>
            <Carousel autoplay={{ dotDuration: true }} pauseOnHover={false} autoplaySpeed={3000}>
                {data && (
                    data.map(item => (
                        <CategoryItem item={item}/>
                    ))
                )}
            </Carousel>
        </>
    )
}

export default TopCategory;