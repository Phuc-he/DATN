import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { UnorderedListOutlined } from '@ant-design/icons';

let items = [];

function Category() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const result = await getCategories();
            setData(result.content);
        }
        fetchApi();
    }, [])

    data.forEach(item => {
        items.push({
            key: item.id,
            label: item.name
        })
    })

    return (
        <>
            <Menu.SubMenu
                key="categories"
                title={
                    <span><UnorderedListOutlined />   Thể loại</span>
                }
            >
                {data.map((item) => (
                    <Menu.Item key={`cat-${item.id}`}><Link to={`categories/${item.id}`} item={item}>{item.name}</Link></Menu.Item>
                ))}
            </Menu.SubMenu>
        </>
    )
} 

export default Category;