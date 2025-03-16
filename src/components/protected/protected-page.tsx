import { Button, Result } from "antd";
import { useCurrentApp } from "components/context/app.context"
import { Link, useLocation } from "react-router-dom";

export const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Result
                status="404"
                title="Chưa đăng nhập"
                subTitle="Vui lòng đăng nhập để sử dụng tính năng này."
                extra={<Button type="primary">
                    <Link to={"/login"}>
                        Đăng nhập
                    </Link>
                </Button>}
            />
        )
    }

    if (isAuthenticated && location.pathname.includes("admin")) {
        const role = user?.role;
        if (role === "USER") {
            return (
                <Result
                    status="403"
                    title="Không có quyền truy cập"
                    subTitle="Bạn không có quyền truy cập trang này!"
                    extra={<Button type="primary">
                        <Link to={"/"}>
                            Back Home
                        </Link>
                    </Button>}
                />
            )
        }
    }

    return (
        <>
            {props.children}
        </>
    )
}