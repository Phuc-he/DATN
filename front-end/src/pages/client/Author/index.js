import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Typography, Avatar } from "antd";
import { getDetailAuthor } from "../../../services/authorService";
import { getBook } from "../../../services/bookService";
import BookItem from "../../../components/TopBook/BookItem";

const { Title, Paragraph } = Typography;

function AuthorDetail() {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const authorRes = await getDetailAuthor(id);
      const booksRes = await getBook();

      setAuthor(authorRes);
      setBooks(booksRes.content);
    };
    fetchData();
  }, [id]);

  if (!author) return null;

  return (
    <div style={{ padding: 24 }}>
      {/* Thông tin tác giả */}
      <Row gutter={24} align="middle">
        <Col>
          <Avatar size={120} src={author.profileImage} />
        </Col>
        <Col>
          <Title level={2}>{author.name}</Title>
          <Paragraph>{author.bio}</Paragraph>
        </Col>
      </Row>

      {/* Danh sách sách */}
      <Title level={3} style={{ marginTop: 32 }}>
        Sách của tác giả
      </Title>

      <Row gutter={[16, 16]}>
        <BookItem
          pagination={{
            currentItems: books
          }}
        />
      </Row>
    </div>
  );
}

export default AuthorDetail;