import type { FormProps } from 'antd';
import { App, Button, Divider, Form, Input } from 'antd';
import { useCurrentApp } from 'components/context/app.context';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from 'services/api';


type FieldType = {
    username: string;
    password: string;
};

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const { setUser, setIsAuthenticated } = useCurrentApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { username, password } = values;
        const res = await loginApi(username, password);

        if (res?.data) {
            setIsAuthenticated(true);
            setUser(res.data.user);
            localStorage.setItem("access_token", res.data.access_token)
            message.success("Đăng nhập thành công!");
            navigate("/");
        } else {
            notification.error({
                message: "Có lỗi xảy ra!",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message
            });
        }
        setIsSubmit(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='register' style={{ padding: '50px' }}>
            <h2 style={{ textAlign: 'center' }} className='text text-large'>Đăng Nhập</h2>
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
                <Form.Item<FieldType>
                    labelCol={{ span: '24' }}
                    label="Email"
                    name="username"
                    rules={[
                        { required: true, message: 'Hãy nhập email!' },
                        { type: "email", message: 'Email không đúng định dạng!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    labelCol={{ span: '24' }}
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    style={{ display: 'flex', justifyContent: 'center' }}
                    wrapperCol={{ span: 24 }}
                >
                    <Button type="primary" htmlType="submit"
                        loading={isSubmit}
                        disabled={isSubmit}
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>
                <Divider>Or</Divider>
                <p className='text text-normal' style={{ textAlign: 'center' }}>
                    Chưa có tài khoản?
                    <span className='navigate' onClick={() => navigate('/register')}>Đăng ký</span>
                </p>
            </Form>

        </div>
    );
}

export default LoginPage;