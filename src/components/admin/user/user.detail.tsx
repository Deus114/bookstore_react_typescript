import { Avatar, Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "services/helper";


interface IProps {
    openViewDetail: boolean,
    setOpenViewDetail: (v: boolean) => void,
    dataViewDetail: IUserTable | null,
    setDataViewDetail: (v: IUserTable | null) => void
}

export const DetailUser = (props: IProps) => {
    const { dataViewDetail, openViewDetail, setDataViewDetail, setOpenViewDetail } = props;
    const OnClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }
    const avatarUrl = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataViewDetail?.avatar}`;

    return (
        <>
            <Drawer
                title="Chi tiết người dùng"
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
                    <Descriptions.Item label="Name">{dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{dataViewDetail?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Role" span={2}>
                        <Badge status='processing' text={dataViewDetail?.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Avatar" span={2}>
                        <Avatar size={40} src={avatarUrl}></Avatar>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created date">
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated date">
                        {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}