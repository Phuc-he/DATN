import { Button } from "antd";
import cat1 from "../../images/cat-1.jpg";
import { Link } from "react-router-dom";

function CategoryItem (props) {
    const { item } = props;

    return (
        <>
            <div key={item.id} className="top-cat__box">
                <div className="top-cat__thumbnail">
                    <img src={cat1} alt={"Title"}/>
                </div>
                <div className="top-cat__content">
                    <h2 className="top-cat__title">{item.name}</h2>
                    <div className="top-cat__desc">{item.description}</div>
                    <Button className="top-cat__button">
                        <Link to={`/categories/${item.id}`} size="large" type="primary">Xem chi tiết</Link>
                    </Button>
                </div>
            </div>
        </>
    )
}

export default CategoryItem;