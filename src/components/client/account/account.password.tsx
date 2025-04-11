import { App, Form, FormProps, Row, Button, Input, Col } from "antd"
import { useCurrentApp } from "components/context/app.context";
import { useEffect, useState } from "react";
import { updateUserPasswordApi } from "services/api";

type FieldType = {
    email: string;
    oldPassword: string;
    newPassword: string
}

const ChangePassword = () => {
    const [form] = Form.useForm();
    const { user, setUser } = useCurrentApp();
    const [isubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                email: user.email,
            })
        }
    }, [user])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { email, oldPassword, newPassword } = values;

        const res = await updateUserPasswordApi(
            email, oldPassword, newPassword
        )

        if (res && res.data) {
            message.success('Cập nhật thành công!');
            localStorage.removeItem("access_token")
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra!',
                description: res.message
            })
        }

        setIsSubmit(false);
    }

    return (
        <div style={{ minHeight: 400 }}>
            <Row>
                <Col sm={24} md={6}></Col>
                <Col sm={24} md={12}>
                    <Form
                        form={form}
                        name="user-info"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Hãy nhập email người dùng!' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Mật khẩu cũ"
                            name="oldPassword"
                            rules={[{ required: true, message: 'Hãy nhập Mật khẩu cũ!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[{ required: true, message: 'Hãy nhập Mật khẩu mới!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={() => form.submit()} type="primary">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>

            </Row>
        </div>
    )
}
export default ChangePassword;