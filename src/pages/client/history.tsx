import { App, Divider, Drawer, Table, TableProps, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getHistoryApi } from "services/api";
import { FORMATE_DATE_VN } from "services/helper";

const HistoryPage = () => {
    const columns: TableProps<IHistory>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            render: (item, record, index) => {
                return dayjs(item).format(FORMATE_DATE_VN);
            }
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (item, record, index) => {
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item);
            }
        },
        {
            title: 'Trạng thái',
            render: (item, record, index) => (
                <Tag color="green">
                    Thành công
                </Tag>
            )
        },
        {
            title: 'Chi tiết',
            render: (_, record) => (
                <a onClick={() => {
                    setOpenDetail(true);
                    setDataDetail(record)
                }} href="#">
                    Xem chi tiết
                </a>
            )
        },
    ];

    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IHistory | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataHistory, setDataHistory] = useState<IHistory[]>([]);

    const { notification } = App.useApp();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let res = await getHistoryApi();
            if (res && res.data) {
                setDataHistory(res.data);
            } else {
                notification.error({
                    message: "Có lỗi xảy ra!",
                    description: res.message
                })
            }
            setLoading(false);
        }
        fetchData();
    }, [])

    return (
        <div style={{ margin: 50 }}>
            <div>Lịch sử mua hàng</div>
            <Divider />
            <Table
                bordered
                columns={columns}
                dataSource={dataHistory}
                rowKey={"_id"}
                loading={loading}
            />
            <Drawer
                title="Chi tiết đơn hàng"
                onClose={() => {
                    setOpenDetail(false);
                    setDataDetail(null);
                }}
                open={openDetail}
            >
                {
                    dataDetail?.detail?.map((item, index) => {
                        return (
                            <ul key={index}>
                                <li>
                                    Tên sách: {item.bookName}
                                </li>
                                <li>
                                    Số lượng: {item.quantity}
                                </li>
                                <Divider />
                            </ul>
                        )
                    })
                }
            </Drawer>
        </div>
    )
}

export default HistoryPage;