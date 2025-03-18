import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { deleteUserApi, getUserApi } from 'services/api';
import { dateRangeValidate } from 'services/helper';
import { DetailUser } from './user.detail';
import { CreateUser } from './user.create';
import { ImportUser } from './data/user.import';
import { CSVLink } from 'react-csv';
import { UpdateUser } from './user.update';

type TSearch = {
    fullName: string,
    email: string,
    createdAt: string,
    createdAtRange: string,
}


const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);
    const [currentTableData, setCurrentTableData] = useState<IUserTable[]>([]);
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);
    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const handleDelete = async (_id: string) => {
        setIsDeleteUser(true);
        const res = await deleteUserApi(_id);
        if (res && res.data) {
            message.success("Xóa thành công!");
            refreshTable();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra!",
                description: res.message
            })
        }
        setIsDeleteUser(false);
    }

    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: "_id",
            dataIndex: "_id",
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a href='#'
                        onClick={() => {
                            setDataViewDetail(entity);
                            setOpenViewDetail(true);
                        }}
                    >{entity._id}</a>
                )
            },
        },
        {
            title: "Full Name",
            dataIndex: "fullName"
        },
        {
            title: "Email",
            dataIndex: "email",
            copyable: true
        },
        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            valueType: "date",
            sorter: true,
            hideInSearch: true
        },
        {
            title: "CreatedAt",
            dataIndex: "createdAtRange",
            valueType: "dateRange",
            hideInTable: true
        },
        {
            title: "Action",
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor='#f57800'
                            style={{
                                cursor: "pointer",
                                marginRight: 15
                            }}
                            onClick={() => {
                                setDataUpdate(entity);
                                setOpenModalUpdate(true);
                            }}
                        />
                        <Popconfirm
                            title="Xác nhận xóa người dùng"
                            description="Bạn có chắc muốn xóa người dùng này?"
                            onConfirm={() => handleDelete(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDeleteUser }}
                        >
                            <DeleteTwoTone
                                twoToneColor='#ff4d4f'
                                style={{
                                    cursor: "pointer",
                                }}
                            />
                        </Popconfirm>
                    </>
                )
            },
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = "";

                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.email) {
                            query += `&email=/${params.email}/i`;
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`;
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                        }
                    }
                    // Default
                    query += `&sort=-createdAt`;

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`;
                    }

                    const res = await getUserApi(query);
                    if (res?.data) {
                        setMeta(res.data.meta);
                        setCurrentTableData(res.data?.result ?? []);
                    }

                    return {
                        data: res?.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => {
                        return (
                            <div>
                                {range[0]} - {range[1]} / {total} rows
                            </div>
                        )
                    }
                }}
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                    >
                        <CSVLink
                            data={currentTableData}
                            filename='user.csv'
                        >
                            Export
                        </CSVLink>
                    </Button>,
                    <Button
                        icon={<CloudUploadOutlined />}
                        onClick={() => {
                            setOpenModalImport(true);
                        }}
                        type="primary"
                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
            <DetailUser
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <CreateUser
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <ImportUser
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                refreshTable={refreshTable}
            />
            <UpdateUser
                dataUpdate={dataUpdate}
                openModalUpdate={openModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
            />
        </>
    );
};

export default TableUser;