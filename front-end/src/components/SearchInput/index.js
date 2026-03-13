import { Input } from "antd";
// import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
function SearchInput () {
  const navigate = useNavigate();
  // const location = useLocation();
  // const [keyword, setKeyword] = useState("");

  // useEffect(() => {
    // const params = new URLSearchParams(location.search);
    // const keywordParam = params.get("keyword") || "";
    // setKeyword(keywordParam);
  // }, [location.search]);

  const onSearch = (value) => {
    if (value) {
      navigate(`/search?keyword=${(value)}`);
    }
  };

  return (
    <>
      <Search
        placeholder="Nhập từ khóa tìm kiếm"
        enterButton="Tìm kiếm"
        size="large"
        allowClear
        // defaultValue={keyword}
        // value={keyword}
        // suffix={<AudioOutlined/>}
        // onChange={(e) => setKeyword(e.target.value)}
        onSearch={onSearch}
      />
    </>
  )
}

export default SearchInput;