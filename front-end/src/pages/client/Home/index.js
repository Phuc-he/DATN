import FeaturedAuthors from "../../../components/Author/FeaturedAuthors";
import TopBook from "../../../components/TopBook";
import TopCategory from "../../../components/TopCategory";
import Welcome from "../../../components/Welcome";

function Home () {
    return (
        <>
            <Welcome/>
            <TopCategory/>
            <TopBook/>
            <FeaturedAuthors/>
        </>
    )
}

export default Home