import { App, Button, Divider, Form, FormProps, Input, Modal } from "antd";
import { useState } from "react";
import { createUserApi } from "services/api";

interface IProps {
    openModalCreate: boolean,
    setOpenModalCreate: (v: boolean) => void,
    refreshTable: () => void
}

type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string;
}

export const CreateUser = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [isubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, email, password, phone } = values;
        setIsSubmit(true);
        const res = await createUserApi(fullName, email, password, phone);
        if (res && res.data) {
            message.success('Tạo mới user thành công!');
            form.resetFields();
            setOpenModalCreate(false);
            refreshTable();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra!",
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    return (
        <>
            <Modal
                style={{ marginTop: "-3%" }}
                title="Thêm mới người dùng"
                open={openModalCreate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalCreate(false);
                    form.resetFields();
                }}
                okText="Tạo mới"
                cancelText="Hủy"
                confirmLoading={isubmit}
            >
                <Divider />
                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Hãy nhập họ và tên!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
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
                        labelCol={{ span: 24 }}
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Hãy nhập số diện thoại!' }]}
                    >
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>
        </>
    )
}