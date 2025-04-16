import { Row, Col, Rate, Divider, App, Breadcrumb } from 'antd';
import './book.scss';
import { useEffect, useRef, useState } from 'react';
import { HomeOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import ImageGallery from 'react-image-gallery';
import ModalGallery from './modal.gallery';
import { useCurrentApp } from 'components/context/app.context';
import { useNavigate } from 'react-router-dom';

interface IProps {
    currentBook: IBookTable;
}

const BookDetail = (props: IProps) => {
    const { currentBook } = props;
    const [imgGallery, setImgGallery] = useState<{
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[]>([]);
    const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const refGallery = useRef<ImageGallery>(null)
    const [currentQuantity, setCurrentQuantity] = useState<number>(1);
    const { carts, setCarts, user } = useCurrentApp();
    const { message } = App.useApp();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentBook) {
            let images = [];
            if (currentBook.thumbnail) {
                images.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                    originalClass: 'original-image',
                    thumbnailClass: 'thumbnail-image'
                })
            }
            if (currentBook.slider) {
                currentBook.slider?.map(item => {
                    images.push({
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        originalClass: 'original-image',
                        thumbnailClass: 'thumbnail-image'
                    },)
                })
            }
            setImgGallery(images)
        }
    }, [currentBook])

    const handleOnClickImage = () => {
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
    }

    const handleClickButton = (type: string) => {
        if (type === "MINUS") {
            if (currentQuantity - 1 === 0) return;
            setCurrentQuantity(currentQuantity - 1);
        }
        if (type === "PLUS") {
            if (currentQuantity === +currentBook.quantity) return;
            setCurrentQuantity(currentQuantity + 1);
        }
    }

    const handleChangeInput = (value: string) => {
        if (!isNaN(+value)) {
            if (+value > 0 && currentBook && +value < +currentBook.quantity) {
                setCurrentQuantity(+value);
            }
        }
    }

    const handleAddCart = (isBuyNow = false) => {
        if (user) {
            let carts = localStorage.getItem("carts");
            if (carts && currentBook) {
                let cart = JSON.parse(carts) as ICarts[];
                let isExistIndex = cart.findIndex(c => c._id === currentBook?._id);
                if (isExistIndex > -1) {
                    cart[isExistIndex].quantity = cart[isExistIndex].quantity + currentQuantity
                } else {
                    cart.push({
                        _id: currentBook._id,
                        quantity: currentQuantity,
                        detail: currentBook
                    })
                }
                localStorage.setItem("carts", JSON.stringify(cart));
                setCarts(cart);
            } else {
                let data = [{
                    _id: currentBook._id,
                    quantity: currentQuantity,
                    detail: currentBook
                }];
                localStorage.setItem("carts", JSON.stringify(data));
                setCarts(data);
            }
            if (isBuyNow)
                navigate("/order");
            else
                message.success("Thêm vào giỏ hàng thành công!");
        }
        else message.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
    }

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <Breadcrumb separator={">"} style={{ marginLeft: "4%", marginBottom: "1%" }}
                    items={[
                        {
                            href: '/',
                            title: <HomeOutlined />,
                        },
                        {
                            href: '',
                            title: (
                                <>
                                    <span>Xem Chi tiết</span>
                                </>
                            ),
                        },
                    ]}
                />
                <div style={{ width: "90%", marginLeft: "4%", padding: "20px", background: '#fff', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <ImageGallery
                                ref={refGallery}
                                items={imgGallery}
                                showPlayButton={false} //hide play button
                                showFullscreenButton={false} //hide fullscreen button
                                renderLeftNav={() => <></>} //left arrow === <> </>
                                renderRightNav={() => <></>}//right arrow === <> </>
                                slideOnThumbnailOver={true}  //onHover => auto scroll images
                                onClick={() => handleOnClickImage()}
                            />
                        </Col>
                        <Col md={14} sm={24}>
                            <Col md={0} sm={24} xs={24}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={imgGallery}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    showThumbnails={false}
                                />
                            </Col>
                            <Col span={24}>
                                <div className='author'>Tác giả: <a href='#'>{currentBook?.author}</a> </div>
                                <div className='title'>{currentBook?.mainText}</div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                    <span className='sold'>
                                        <Divider type="vertical" />
                                        Đã bán {currentBook?.sold}</span>
                                </div>
                                <div className='price'>
                                    <span className='currency'>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBook?.price ?? 0)}đ
                                    </span>
                                </div>
                                <div className='delivery'>
                                    <div>
                                        <span className='left'>Vận chuyển</span>
                                        <span className='right'>Miễn phí vận chuyển</span>
                                    </div>
                                </div>
                                <div className='quantity'>
                                    <span className='left'>Số lượng</span>
                                    <span className='right'>
                                        <button onClick={() => handleClickButton('MINUS')}><MinusOutlined /></button>
                                        <input value={currentQuantity} onChange={(event) => handleChangeInput(event.target.value)} />
                                        <button onClick={() => handleClickButton('PLUS')}><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className='buy'>
                                    <button className='cart'
                                        onClick={() => handleAddCart()}
                                    >
                                        <BsCartPlus className='icon-cart' />
                                        <span>Thêm vào giỏ hàng</span>
                                    </button>
                                    <button className='now'
                                        onClick={() => handleAddCart(true)}
                                    >Mua ngay</button>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={imgGallery}
                title={currentBook?.mainText ?? ""}
            />
        </div>
    )
}

export default BookDetail;