import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { deleteUserApi, getOrdersApi, getUserApi } from 'services/api';
import { dateRangeValidate } from 'services/helper';
import { CSVLink } from 'react-csv';

type TSearch = {
    name: string,
    createdAt: string,
    createdAtRange: string,
}


const TableOrder = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    const [currentTableData, setCurrentTableData] = useState<IHistory[]>([]);

    const columns: ProColumns<IHistory>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: "_id",
            dataIndex: "_id",
            hideInSearch: true,
        },
        {
            title: "Tên",
            dataIndex: "name"
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            copyable: true,
            hideInSearch: true,
        },
        {
            title: "Giá tiền",
            dataIndex: "totalPrice",
            hideInSearch: true,
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
    ];

    return (
        <>
            <ProTable<IHistory, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = "";

                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.name) {
                            query += `&name=/${params.name}/i`;
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                        }
                    }

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`;
                    } else // Default
                        query += `&sort=-createdAt`;

                    const res = await getOrdersApi(query);
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
                    React.createElement(CSVLink, {
                        data: currentTableData,
                        filename: 'order.csv',
                        children: (
                            <Button
                                icon={<ExportOutlined />}
                                type="primary"
                            >
                                Export
                            </Button>
                        )
                    }),
                ]}
            />
        </>
    );
};

export default TableOrder;