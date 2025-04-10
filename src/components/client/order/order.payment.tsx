import { App, Button, Col, Empty, Form, Input, InputNumber, Radio, Row, Space, } from 'antd';
import './order.scss';
import { useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { useCurrentApp } from 'components/context/app.context';
import type { FormProps } from 'antd';
import { createOrderApi } from 'services/api';


interface IProps {
    setCurrentStep: (v: number) => void;
}

type UserMethod = "COD" | "BANKING";

type FieldType = {
    fullName: string;
    phone: string;
    address: string;
    method: UserMethod;
};

const Payment = (props: IProps) => {
    const { carts, user, setCarts } = useCurrentApp();
    const [total, setTotal] = useState(0);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [form] = Form.useForm<FieldType>();
    const { setCurrentStep } = props;
    const { message, notification } = App.useApp();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone,
                method: "COD"
            })
        }
    }, [user])

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            })
            setTotal(sum);
        } else {
            setTotal(0);
        }
    }, [carts])

    const handlePlaceOrder: FormProps<FieldType>['onFinish'] = async (value) => {
        setIsSubmit(true)
        const { address, fullName, method, phone } = value;
        const detail = carts.map(item => ({
            _id: item._id,
            quantity: item.quantity,
            bookName: item.detail.mainText
        }))

        const res = await createOrderApi(
            fullName, address, phone, total, method, detail
        )
        if (res && res.data) {
            localStorage.removeItem("carts");
            setCarts([]);
            message.success("Mua hàng thành công!");
            setCurrentStep(2);
        } else {
            notification.error({
                message: "Có lỗi xảy ra!",
                description: res?.message
            })
        }
        setIsSubmit(false);
    }

    return (
        <Row gutter={[20, 20]}>
            <Col md={16} xs={24}>
                {
                    carts.length === 0 ?
                        <Empty
                            description="Không có sản phẩm nào"
                            style={{ backgroundColor: "white", height: "100%" }}
                        />
                        :
                        carts?.map((book, index) => {
                            return (
                                <div className='order-book' key={index}>
                                    <div className='book-content'>
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail.thumbnail}`} />
                                        <div className='title'>
                                            {book?.detail?.mainText}
                                        </div>
                                        <div className='price'>
                                            {book?.detail?.price?.toLocaleString()}đ
                                        </div>
                                    </div>
                                    <div className='action'>
                                        <div className='quantity'>
                                            <InputNumber value={book.quantity} disabled />
                                        </div>
                                        <div className='sum'>
                                            {(+book?.detail?.price * book?.quantity)?.toLocaleString()}đ
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                }
                <a style={{ cursor: "pointer", marginLeft: "5px" }}
                    onClick={() => setCurrentStep(0)}>Quay lại</a>
            </Col>
            <Col md={8} xs={24} >
                <div className='order-info'>
                    <Form
                        name="basic"
                        labelCol={{ span: 12 }}
                        style={{ margin: '0 auto' }}
                        onFinish={handlePlaceOrder}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item<FieldType>
                            labelCol={{ span: '24' }}
                            label="Tên người nhận"
                            name="fullName"
                            rules={[{ required: true, message: 'Hãy nhập tên!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            labelCol={{ span: '24' }}
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Hãy nhập số điện thoại!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            labelCol={{ span: '24' }}
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Hãy nhập địa chỉ!' }]}
                        >
                            <TextArea />
                        </Form.Item>

                        <Form.Item<FieldType>
                            labelCol={{ span: '24' }}
                            label="Phương thức thanh toán"
                            name="method"
                            rules={[{ required: true, message: 'Hãy chọn phương thức thanh toán!' }]}
                        >
                            <Radio.Group>
                                <Space direction='vertical'>
                                    <Radio value={"COD"}>Thanh toán khi nhận hàng</Radio>
                                    <Radio value={"BANKING"}>Chuyển khoản ngân hàng</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>

                        <div className='calculate'>
                            <span> Tổng tiền</span>
                            <span className='sum-final'>{total.toLocaleString()}đ</span>
                        </div>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={isSubmit}>
                                Đặt hàng ({carts?.length})
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col >
        </Row >
    )
}

export default Payment