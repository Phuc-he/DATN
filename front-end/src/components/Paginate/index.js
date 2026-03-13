import { Pagination } from "antd";
import './Paginate.scss';



function Paginate (props) {
    const { pagination, setCurrentPage } = props;

    const handleChange = (page) => {
        setCurrentPage(page);
    }

    return (
        <>
            <Pagination 
                onChange={handleChange} 
                pageSize={pagination.limitItems} 
                // page={pagination.totalPage}
                responsive={true} 
                className="pagination" 
                align="center" 
                defaultCurrent={1} 
                total={pagination.quantityItem} 
            />
        </>
    )
}

export default Paginate;