import { useState } from 'react';
import { FaReact } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import {
    Divider, Badge, Drawer, Avatar, Popover, Empty, Row, Col, App,
} from 'antd';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import './app.header.scss';
import { Link } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import { logoutApi } from 'services/api';
import ManageAccount from 'components/client/account/account.manage';
import {
    CheckCircleOutlined,
    CarOutlined,
    SyncOutlined,
    GiftOutlined,
    ClockCircleOutlined,
    TagOutlined
} from '@ant-design/icons';

const AppHeader = (props: any) => {
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);
    const { isAuthenticated, user, setUser, setIsAuthenticated, carts, setCarts } = useCurrentApp();
    const { message } = App.useApp();
    const navigate = useNavigate();

    const handleLogout = async () => {
        let res = await logoutApi();
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
            localStorage.removeItem("carts");
            setCarts([]);
            message.success("Đăng xuất thành công!")
        }
    }

    let items = [
        {
            label: <a onClick={() => setOpenManageAccount(true)}>
                <label style={{ cursor: 'pointer' }}>Quản lý tài khoản</label>
            </a>,
            key: 'account',
        },
        {
            label: <Link to="/history">Lịch sử mua hàng</Link>,
            key: 'history',
        },
        {
            label: <a onClick={() => handleLogout()}>
                <label style={{ cursor: 'pointer' }}>Đăng xuất</label>
            </a>,
            key: 'logout',
        },
    ];

    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin',
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const contentPopover = () => (
        <div className='pop-cart-body'>
            <div className='pop-cart-content'>
                {carts?.map((book, index) => (
                    <div className='book' key={`book-${index}`}>
                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                        <Row className='detail'>
                            <Col className='mainText'><div>{book?.detail?.mainText}</div></Col>
                            <Col className='price'>
                                <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price ?? 0)}</div>
                            </Col>
                            <Col className='quantity'><div>SL: {book?.quantity}</div></Col>
                        </Row>
                    </div>
                ))}
                {carts.length > 0 ?
                    <div className='pop-cart-footer'>
                        <button onClick={() => navigate('/order')}>Xem giỏ hàng</button>
                    </div>
                    :
                    <Empty description="Không có sản phẩm trong giỏ hàng" />
                }
            </div>
        </div>
    );

    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => setOpenDrawer(true)}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo'>
                                <span onClick={() => navigate('/')}> <FaReact className='rotate icon-react' /></span>
                                <VscSearchFuzzy className='icon-search' />
                            </span>
                            <input
                                className="input-search" type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                                value={props.searchTerm}
                                onChange={(e) => props.setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Popover
                                    className="popover-carts"
                                    placement="topRight"
                                    rootClassName="popover-carts"
                                    title={"Sản phẩm mới thêm"}
                                    content={contentPopover}
                                    arrow={true}>
                                    <Badge count={carts?.length ?? 0} size={"small"} showZero>
                                        <FiShoppingCart className='icon-cart' />
                                    </Badge>
                                </Popover>
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical' /></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ? (
                                    <span onClick={() => navigate('/login')}>Tài Khoản</span>
                                ) : (
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <Space>
                                            <Avatar src={urlAvatar} />
                                            {user?.fullName}
                                        </Space>
                                    </Dropdown>
                                )}
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <div className="commit-bar">
                <div className="commit-item"><CheckCircleOutlined className="icon" /> 100% hàng thật</div>
                <div className="commit-item"><CarOutlined className="icon" /> Freeship mọi đơn</div>
                <div className="commit-item"><SyncOutlined className="icon" /> Hoàn 200% nếu hàng giả</div>
                <div className="commit-item"><GiftOutlined className="icon" /> 30 ngày đổi trả</div>
                <div className="commit-item"><ClockCircleOutlined className="icon" /> Giao nhanh 2h</div>
                <div className="commit-item"><TagOutlined className="icon" /> Giá siêu rẻ</div>
            </div>

            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Quản lý tài khoản</p>
                <Divider />
                <p onClick={() => handleLogout()}>Đăng xuất</p>
                <Divider />
            </Drawer>

            <ManageAccount
                isOpenModal={openManageAccount}
                setIsOpenModal={setOpenManageAccount}
            />
        </>
    )
};

export default AppHeader;
