import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, Upload, UploadProps } from "antd";
import { useState } from "react";
const { Dragger } = Upload;
import Exeljs from 'exceljs';
import { Buffer } from "buffer";
import { bulkCreateUserApi } from "services/api";
import templateFile from "assets/template/users.xlsx?url";

interface IProps {
    openModalImport: boolean,
    setOpenModalImport: (v: boolean) => void,
    refreshTable: () => void
}

interface IDataImport {
    fullName: string,
    email: string,
    phone: string,
}

export const ImportUser = (props: IProps) => {
    const { openModalImport, setOpenModalImport, refreshTable } = props;
    const { message, notification } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const propsUpload: UploadProps = {
        name: "file",
        multiple: false,
        maxCount: 1,

        accept: ".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000)
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);

                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    //load file buffer
                    const workbook = new Exeljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);

                    // convert to JSON
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        // read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;
                        let keys = firstRow.values as any;
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any
                            let obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })
                    });
                    jsonData = jsonData.map((item, index) => {
                        return {
                            ...item,
                            id: index
                        }
                    })
                    setDataImport(jsonData);
                }

            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
        },
    }

    const handleImport = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }))
        const res = await bulkCreateUserApi(dataSubmit);
        if (res.data) {
            notification.success({
                message: "Import users",
                description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`
            })
        }
        setIsSubmit(false);
        setDataImport([]);
        setOpenModalImport(false);
        refreshTable();
    }

    return (
        <>
            <Modal
                style={{ marginTop: "-5%" }}
                title="Import data user"
                width={"50vw"}
                open={openModalImport}
                onOk={() => handleImport()}
                onCancel={() => {
                    setOpenModalImport(false);
                    setDataImport([]);
                }}
                okText="Import"
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: isSubmit
                }}
                destroyOnClose={true}
                maskClosable={false}
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls, .xlsx files.
                        &nbsp;
                        <a
                            onClick={e => e.stopPropagation()}
                            href={templateFile}
                            download
                        >
                            DownLoad Sample File
                        </a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        rowKey={"id"}
                        title={() => <span>Dữ liệu Upload</span>}
                        dataSource={dataImport}
                        columns={[
                            { dataIndex: "fullName", title: "Tên hiển thị" },
                            { dataIndex: "email", title: "Email" },
                            { dataIndex: "phone", title: "Số điện thoại" }
                        ]}
                    />
                </div>
            </Modal>
        </>
    )
}