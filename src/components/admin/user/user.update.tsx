import { App, Divider, Form, FormProps, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { updateUserApi } from "services/api";

interface IProps {
    openModalUpdate: boolean,
    setOpenModalUpdate: (v: boolean) => void,
    refreshTable: () => void,
    dataUpdate: IUserTable | null,
    setDataUpdate: (v: IUserTable | null) => void
}

type FieldType = {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
}

export const UpdateUser = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, refreshTable,
        setDataUpdate, dataUpdate
    } = props;
    const [isubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, _id, phone } = values;
        setIsSubmit(true);
        const res = await updateUserApi(_id, fullName, phone);
        if (res && res.data) {
            message.success('Tạo mới user thành công!');
            form.resetFields();
            setOpenModalUpdate(false);
            setDataUpdate(null);
            refreshTable();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra!",
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                _id: dataUpdate._id,
                email: dataUpdate.email,
                fullName: dataUpdate.fullName,
                phone: dataUpdate.phone
            })
        }
    }, [dataUpdate])

    return (
        <>
            <Modal
                style={{ marginTop: "-3%" }}
                title="Cập nhật thông tin người dùng"
                open={openModalUpdate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                    form.resetFields();
                }}
                okText="Cập nhật"
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
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="_id"
                        name="_id"
                        hidden
                    >
                        <Input disabled />
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