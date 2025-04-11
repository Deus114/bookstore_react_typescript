import { Card, Col, Row, Statistic } from "antd"
import { useEffect, useState } from "react"
import CountUp from "react-countup"
import { getDashboardApi } from "services/api"

const Dashboard = () => {
    const [dataDashboard, setDataDashBoard] = useState({
        countOrder: 0,
        countUser: 0,
        countBook: 0,
    })

    useEffect(() => {
        const getDashboard = async () => {
            let res = await getDashboardApi();
            if (res && res.data) {
                setDataDashBoard(res.data);
            }
        }
        getDashboard();
    }, [])

    const formatter = (value: any) => <CountUp end={value} separator="," />;

    return (
        <Row
            gutter={[40, 40]}
        >
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Người dùng"
                        value={dataDashboard.countUser}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Sách"
                        value={dataDashboard.countBook}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Đơn hàng"
                        value={dataDashboard.countOrder}
                        formatter={formatter}
                    />
                </Card>
            </Col>
        </Row>
    )
}
export default Dashboard;