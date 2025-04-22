import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/app.header";
import { useState } from "react";
import Footer from "components/layout/footer.client";

const Layout = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    return (
        <>
            <div>
                <AppHeader
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <Outlet context={[searchTerm, setSearchTerm]} />
                <Footer />
            </div>
        </>
    )
}

export default Layout;