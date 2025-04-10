import { Button, Col, Divider, Empty, InputNumber, Row, message, } from 'antd';
import './order.scss';
import { DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useCurrentApp } from 'components/context/app.context';

interface IProps {
    setCurrentStep: (v: number) => void;
}

const OrderDetail = (props: IProps) => {
    const { carts, setCarts } = useCurrentApp();
    const [total, setTotal] = useState(0);
    const { setCurrentStep } = props;

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            })
            setTotal(sum);
        } else {
            setTotal(0);
        }
    }, [carts])

    const handleOnchange = (value: number, book: IBookTable) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            const cartStorage = localStorage.getItem("carts");
            if (cartStorage && book) {
                // Update
                const carts = JSON.parse(cartStorage) as ICarts[];
                // Check exist
                let isExistIndex = carts.findIndex(c => c._id === book?._id);
                if (isExistIndex > -1) {
                    carts[isExistIndex].quantity = +value;
                }
                localStorage.setItem("carts", JSON.stringify(carts));
                setCarts(carts);
            }
        }
    }

    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            // Update
            const carts = JSON.parse(cartStorage) as ICarts[];
            let newCart = carts.filter(c => c._id !== _id);
            localStorage.setItem("carts", JSON.stringify(newCart));
            setCarts(newCart);
        }
    }

    return (
        <Row gutter={[20, 20]}>
            <Col md={16} xs={24}>
                {
                    carts.length === 0 ?
                        <Empty
                            description="Không có sản phẩm nào"
                            style={{ backgroundColor: "white", height: "100%" }}
                        />
                        :
                        carts?.map((book, index) => {
                            return (
                                <div className='order-book' key={index}>
                                    <div className='book-content'>
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail.thumbnail}`} />
                                        <div className='title'>
                                            {book?.detail?.mainText}
                                        </div>
                                        <div className='price'>
                                            {book?.detail?.price?.toLocaleString()}đ
                                        </div>
                                    </div>
                                    <div className='action'>
                                        <div className='quantity'>
                                            <InputNumber onChange={(value) => handleOnchange(value as number, book.detail)}
                                                value={book.quantity} />
                                        </div>
                                        <div className='sum'>
                                            {(+book?.detail?.price * book?.quantity)?.toLocaleString()}đ
                                        </div>
                                        <Button onClick={() => handleRemoveBook(book?._id)}><DeleteOutlined /></Button>

                                    </div>
                                </div>
                            )
                        })
                }
            </Col>
            <Col md={8} xs={24} >
                <div className='order-sum'>
                    <div className='calculate'>
                        <span>  Tạm tính</span>
                        <span>{total.toLocaleString()}đ</span>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <div className='calculate'>
                        <span> Tổng tiền</span>
                        <span className='sum-final'>{total.toLocaleString()}đ</span>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <button onClick={() => {
                        if (carts?.length === 0) {
                            message.error("Không có sản phẩm nào trong giỏ hàng !")
                            return;
                        }
                        setCurrentStep(1)
                    }}>Mua Hàng ({carts?.length})</button>
                </div>
            </Col>
        </Row>
    )
}

export default OrderDetail;
