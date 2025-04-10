import { SmileOutlined } from "@ant-design/icons";
import { Button, Col, Result, Steps } from "antd";
import OrderDetail from "components/client/order/order.detail";
import Payment from "components/client/order/order.payment";
import { useState } from "react";
import { Link } from "react-router-dom";

const OrderPage = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Steps
                    style={{ padding: "15px", backgroundColor: "white", marginBottom: "20px" }}
                    size="small"
                    current={currentStep}
                    items={[
                        {
                            title: 'Đơn hàng',
                        },
                        {
                            title: 'Đặt hàng',
                        },
                        {
                            title: 'Thanh toán',
                        },
                    ]}
                />
                {
                    currentStep === 0 &&
                    <OrderDetail
                        setCurrentStep={setCurrentStep}
                    />
                }
                {
                    currentStep === 1 &&
                    <Payment
                        setCurrentStep={setCurrentStep}
                    />
                }
                {
                    currentStep === 2 &&
                    <Col md={24} xs={24}>
                        <Result
                            status={"success"}
                            icon={<SmileOutlined />}
                            title="Bạn đã đặt hàng thành công!"
                            subTitle="Hệ thống đã ghi nhận thông tin đơn hàng của bạn"
                            extra={[
                                <Button key={"home"}>
                                    <Link to={"/"} type="primary">
                                        Trang chủ
                                    </Link>
                                </Button>,
                                <Button key={"history"} type="primary">
                                    <Link to={"/history"} type="primary">
                                        Lịch sử mua hàng
                                    </Link>
                                </Button>
                            ]}
                        />
                    </Col>
                }
            </div>
        </div>
    )
}

export default OrderPage;