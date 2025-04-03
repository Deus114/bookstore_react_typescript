import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { deleteBookApi, getBookApi } from 'services/api';
import { dateRangeValidate } from 'services/helper';
import { CSVLink } from 'react-csv';
import { DetailBook } from './book.detail';
import { CreateBook } from './book.create';
import { UpdateBook } from './book.update';

type TSearch = {
    mainText: string,
    author: string,
    createdAt: string,
    createdAtRange: string,
}


const TableBook = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);
    const [currentTableData, setCurrentTableData] = useState<IBookTable[]>([]);
    const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);
    const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const handleDelete = async (_id: string) => {
        setIsDeleteBook(true);
        const res = await deleteBookApi(_id);
        if (res && res.data) {
            message.success("Xóa thành công!");
            refreshTable();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra!",
                description: res.message
            })
        }
        setIsDeleteBook(false);
    }

    const columns: ProColumns<IBookTable>[] = [
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
            title: "Tên sách",
            dataIndex: "mainText"
        },
        {
            title: "Thể loại",
            dataIndex: "category",
        },
        {
            title: "Tác giả",
            dataIndex: "author",
            sorter: true,
            hideInSearch: true
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
                            title="Xác nhận xóa sách"
                            description="Bạn có chắc muốn xóa sách này?"
                            onConfirm={() => handleDelete(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDeleteBook }}
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
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.mainText) {
                            query += `&email=/${params.mainText}/i`;
                        }
                        if (params.author) {
                            query += `&fullName=/${params.author}/i`;
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

                    const res = await getBookApi(query);
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
                    <CSVLink
                        data={currentTableData}
                        filename='book.csv'
                    >
                        <Button
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button>
                    </CSVLink>,
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

            <DetailBook
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <CreateBook
                openModalCreate={openModalCreate}
                refreshTable={refreshTable}
                setOpenModalCreate={setOpenModalCreate}
            />
            <UpdateBook
                openModalUpdate={openModalUpdate}
                refreshTable={refreshTable}
                setOpenModalUpdate={setOpenModalUpdate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    );
};

export default TableBook;