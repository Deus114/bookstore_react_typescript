import { Descriptions, Divider, Drawer, Image, Upload, UploadFile, UploadProps } from "antd";
import { GetProp } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FORMATE_DATE_VN } from "services/helper";
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    openViewDetail: boolean,
    setOpenViewDetail: (v: boolean) => void,
    dataViewDetail: IBookTable | null,
    setDataViewDetail: (v: IBookTable | null) => void
}

export const DetailBook = (props: IProps) => {
    const { dataViewDetail, openViewDetail, setDataViewDetail, setOpenViewDetail } = props;
    const OnClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }

    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (dataViewDetail) {
            let imgThumbnail: any = {}, imgSlider: UploadFile[] = [];
            if (dataViewDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataViewDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail.thumbnail}`
                }
            }
            if (dataViewDetail.slider) {
                dataViewDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [dataViewDetail])

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    return (
        <>
            <Drawer
                title="Chi tiết sản phẩm"
                width={"50vw"}
                onClose={OnClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin người dùng"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên sách">{dataViewDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Thể loại">{dataViewDetail?.category}</Descriptions.Item>
                    <Descriptions.Item label="Tác giả">{dataViewDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Giá tiền" span={2}>
                        {new Intl.NumberFormat('vi-VN',
                            { style: 'currency', currency: 'VND' })
                            .format(dataViewDetail?.price ?? 0)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created date">
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated date">
                        {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left">Hình ảnh</Divider>

                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                >
                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>
        </>
    )
}