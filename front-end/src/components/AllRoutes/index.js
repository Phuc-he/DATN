import { useRoutes } from "react-router-dom";
import { routesClient } from "../../routes/RoutesClient/index";
import { routesAdmin } from "../../routes/RoutesAdmin/index";

function AllRoutes () {
    const elementsClient = useRoutes(routesClient);
    const elementsAdmin = useRoutes(routesAdmin);

    return (
        <>
            {elementsClient}
            {elementsAdmin}
        </>
    )
}

export default AllRoutes;