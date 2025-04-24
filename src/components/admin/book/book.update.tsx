import { App, Col, Divider, Form, FormProps, GetProp, Input, InputNumber, Modal, Row, Select, Upload, UploadProps } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useEffect, useState } from "react";
import { createBookApi, getCategoriesApi, uploadFileApi } from "services/api";
import type { UploadFile } from 'antd';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    openModalUpdate: boolean,
    setOpenModalUpdate: (v: boolean) => void,
    refreshTable: () => void
    dataUpdate: IBookTable | null,
    setDataUpdate: (v: IBookTable | null) => void
}

type FieldType = {
    _id: string;
    mainText: string;
    author: string;
    category: string;
    price: number;
    quantity: number;
    thumbnail: any;
    slider: any
}

type UserUploadType = "thumbnail" | "slider";

export const UpdateBook = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, refreshTable
        , dataUpdate, setDataUpdate
    } = props;
    const { message, notification } = App.useApp();
    const [listCatergories, setListCategories] = useState<{
        label: string,
        value: string
    }[]>([]);

    const [isubmit, setIsSubmit] = useState<boolean>(false);
    const [isLoadingThumbnail, setIsLoadingThumbnail] = useState<boolean>(false);
    const [isLoadingSlider, setIsLoadingSlider] = useState<boolean>(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            let res = await getCategoriesApi();
            if (res && res.data) {
                let d = res.data.map(item => {
                    return {
                        label: item,
                        value: item
                    }
                })
                setListCategories(d);
            }
        }
        fetchCategories();
    }, [])

    useEffect(() => {
        if (dataUpdate) {
            let arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: dataUpdate.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`
                }
            ]
            let sliders = dataUpdate?.slider?.map(item => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                }
            })

            form.setFieldsValue({
                _id: dataUpdate._id,
                mainText: dataUpdate.mainText,
                author: dataUpdate.author,
                category: dataUpdate.category,
                price: dataUpdate.price,
                quantity: dataUpdate.quantity,
                thumbnail: arrThumbnail,
                slider: sliders
            })

            setFileListThumbnail(arrThumbnail as any);
            setFileListSlider(sliders as any);
        }
    }, [dataUpdate])

    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { mainText, author, price, quantity, category } = values;
        const thumbnail = fileListThumbnail?.[0]?.name ?? "";
        const slider = fileListSlider?.map(item => item.name) ?? [];

        const res = await createBookApi(
            mainText, author, category, price, quantity, thumbnail, slider
        )

        if (res && res.data) {
            message.success('Tạo mới sách thành công!');
            form.resetFields();
            setFileListSlider([]);
            setFileListThumbnail([]);
            setOpenModalUpdate(false);
            setDataUpdate(null);
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra!',
                description: res.message
            })
        }

        setIsSubmit(false);
    }

    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };

    const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
        if (info.file.status === 'uploading') {
            type === "thumbnail" ? setIsLoadingThumbnail(true) : setIsLoadingThumbnail(false)
            type === "slider" ? setIsLoadingSlider(true) : setIsLoadingSlider(false)
            return;
        }
        setIsLoadingThumbnail(false)
        setIsLoadingSlider(false)
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileApi(file, "book");
        if (res && res.data) {
            let uploadFile: any = {
                uid: file.uid,
                name: res.data.fileName,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileName}`
            }
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadFile }]);
            } else {
                setFileListSlider((prevState) => [...prevState, { ...uploadFile }]);
            }
            if (onSuccess) {
                onSuccess("ok");
            }
        } else {
            message.error(res.message);
        }
    }

    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === "thumbnail") {
            setFileListThumbnail([]);
        }
        if (type = "slider") {
            const newSlider = fileListSlider.filter(x => x.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    }

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        } return e?.fileList;
    }

    return (
        <>
            <Modal
                style={{ marginTop: "-3%" }}
                title="Cập nhật sách"
                open={openModalUpdate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    form.resetFields();
                    setFileListSlider([]);
                    setFileListThumbnail([]);
                    setDataUpdate(null);
                }}
                okText="Cập nhật"
                cancelText="Hủy"
                confirmLoading={isubmit}
                width={"50vw"}
            >
                <Divider />
                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="_id"
                                name="_id"
                                hidden
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên sách"
                                name="mainText"
                                rules={[{ required: true, message: 'Hãy nhập tên sách!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tác giả"
                                name="author"
                                rules={[
                                    { required: true, message: 'Hãy upload thumbnail!' },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={15}>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Giá tiền"
                                name="price"
                                rules={[
                                    { required: true, message: 'Hãy nhập giá tiền!' },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: '100%' }}
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    addonAfter="đ"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thể loại"
                                name="category"
                                rules={[
                                    { required: true, message: 'Hãy chọn thể loại!' },
                                ]}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    options={listCatergories}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Số lượng"
                                name="quantity"
                                rules={[
                                    { required: true, message: 'Hãy số lượng!' },
                                ]}

                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Ảnh thumbnail"
                                name="thumbnail"
                                rules={[
                                    { required: true, message: 'Hãy upload thumbnail!' },
                                ]}

                                // Convert value from upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'thumbnail')}
                                    onRemove={(info) => handleRemove(info, 'thumbnail')}
                                    onPreview={handlePreview}
                                    fileList={fileListThumbnail}
                                >
                                    {isLoadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh slider"
                                name="slider"
                                rules={[
                                    { required: true, message: 'Hãy upload slider!' },
                                ]}

                                // Convert value from upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    multiple
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    customRequest={(options) => handleUploadFile(options, 'slider')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onRemove={(info) => handleRemove(info, 'slider')}
                                    onPreview={handlePreview}
                                    fileList={fileListSlider}
                                >
                                    {isLoadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}