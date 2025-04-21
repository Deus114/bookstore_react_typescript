import { HomeOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { App, Button, Divider, Form, Input } from 'antd';
import { useCurrentApp } from 'components/context/app.context';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        <div className={"login-page"}>
            <main className={"main"}>
                <div className={"container"}>
                    <section className={"wrapper"}>
                        <div className={"heading"}>
                            <h2 className={`text text-large`}>Đăng Nhập</h2>
                            <Divider />

                        </div>
                        <Form
                            name="basic"
                            // style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="username"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                style={{ display: 'flex', justifyContent: 'center' }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal" style={{ textAlign: 'center' }}>Chưa có tài khoản ?
                                <span>
                                    <Link to='/register' > Đăng Ký </Link> | <HomeOutlined onClick={() => navigate("/")} />
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default LoginPage;