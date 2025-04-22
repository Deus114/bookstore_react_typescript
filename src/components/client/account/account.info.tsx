import { App, Avatar, Col, Form, FormProps, Row, UploadFile, Upload, Button, Input } from "antd"
import { useCurrentApp } from "components/context/app.context";
import { useEffect, useState } from "react";
import { logoutApi, updateUserInfoApi, uploadFileApi } from "services/api";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { UploadChangeParam } from "antd/es/upload";
import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type FieldType = {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
}

const AccountInfo = () => {
    const [form] = Form.useForm();
    const { user, setUser } = useCurrentApp();
    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "")
    const [isubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();
    const navigate = useNavigate();

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userAvatar}`;

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                _id: user.id,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone
            })
        }
    }, [user])

    const handleUploadFile = async (options: RcCustomRequestOptions) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileApi(file, "avatar");
        if (res && res.data) {
            const newAvatar = res.data.fileName;
            setUserAvatar(newAvatar);
            if (onSuccess)
                onSuccess("ok");
        } else {
            message.error(res.message);
        }
    }

    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadFile,
        onChange(info: UploadChangeParam) {
            if (info.file.status !== "uploading") {
            }
            if (info.file.status === "done") {
                message.success("Tải ảnh thành công!")
            } else if (info.file.status === "error") {
                message.error("Tải ảnh thất bại!")
            }
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { _id, fullName, phone } = values;

        const res = await updateUserInfoApi(
            _id, userAvatar, fullName, phone
        )

        if (res && res.data) {
            await logoutApi();
            setUser(null)
            localStorage.removeItem("access_token")
            message.success('Cập nhật thành công! Vui lòng đăng nhập lại');
            navigate("/login");
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
                <Col sm={24} md={12}>
                    <Row gutter={[30, 30]}>
                        <Col span={24}>
                            <Avatar
                                size={{ xs: 30, sm: 64, md: 80, lg: 128, xl: 160 }}
                                icon={<AntDesignOutlined />}
                                src={urlAvatar}
                                shape="circle"
                            />
                        </Col>
                        <Col span={24}>
                            <Upload
                                {...propsUpload}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Upload Avatar
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                </Col>
                <Col sm={24} md={12}>
                    <Form
                        form={form}
                        name="user-info"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="_id"
                            name="_id"
                            hidden
                        >
                            <Input disabled hidden />
                        </Form.Item>
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
                            label="Tên người dùng"
                            name="fullName"
                            rules={[{ required: true, message: 'Hãy nhập người dùng!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Hãy nhập sđt!' }]}
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
export default AccountInfo;