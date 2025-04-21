import { HomeOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { App, Button, Divider, Form, Input } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerApi } from 'services/api';


type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string;
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { fullName, email, password, phone } = values;

        const res = await registerApi(fullName, email, password, phone);
        if (res.data) {
            message.success("Đăng ký thành công!");
            navigate("/login");
        } else {
            message.error(res.message);
        }
        setIsSubmit(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='register' style={{ padding: '50px' }}>
            <h2 style={{ textAlign: 'center' }} className='text text-large'>Đăng Ký Tài Khoản</h2>
            <Divider />
            <Form
                name="basic"
                labelCol={{ span: 6 }}
                style={{ maxWidth: 600, margin: '0 auto' }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    labelCol={{ span: '24' }}
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Hãy nhập họ và tên!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    labelCol={{ span: '24' }}
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Hãy nhập email!' },
                        { type: "email", message: 'Email không đúng định dạng!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    labelCol={{ span: '24' }}
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    labelCol={{ span: '24' }}
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Hãy nhập số diện thoại!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{ display: 'flex', justifyContent: 'center' }}
                    wrapperCol={{ span: 24 }}
                >
                    <Button type="primary" htmlType="submit"
                        loading={isSubmit}
                        disabled={isSubmit}
                    >
                        Đăng ký
                    </Button>
                </Form.Item>
                <Divider>Or</Divider>
                <p className='text text-normal' style={{ textAlign: 'center' }}>
                    Bạn đã có tài khoản?
                    <span className='navigate' onClick={() => navigate('/login')}>Đăng nhập</span> | <HomeOutlined onClick={() => navigate("/")} />
                </p>
            </Form>

        </div>
    );
}

export default RegisterPage;