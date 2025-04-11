import { Modal, Tabs } from "antd";
import AccountInfo from "./account.info";
import ChangePassword from "./account.password";

interface IProps {
    isOpenModal: boolean;
    setIsOpenModal: (v: boolean) => void;
}

const ManageAccount = (props: IProps) => {
    const { isOpenModal, setIsOpenModal } = props;

    const items = [
        {
            key: "info",
            label: "Cập nhật thông tin",
            children: <AccountInfo />
        },
        {
            key: 'password',
            label: "Đổi mật khẩu",
            children: <ChangePassword />
        }
    ]

    return (
        <Modal
            title="Quản lí tài khoản"
            open={isOpenModal}
            footer={null}
            onCancel={() => setIsOpenModal(false)}
            maskClosable={false}
            width={"60vw"}
        >
            <Tabs
                defaultActiveKey="info"
                items={items}
            />
        </Modal>
    )
}

export default ManageAccount;