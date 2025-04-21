import styles from './Footer.module.scss';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.columns}>
                    <div className={styles.column}>
                        <h4>DỊCH VỤ</h4>
                        <ul>
                            <li>Điều khoản sử dụng</li>
                            <li>Chính sách bảo mật thông tin cá nhân</li>
                            <li>Chính sách bảo mật thanh toán</li>
                            <li>Giới thiệu</li>
                            <li>Hệ thống trung tâm - nhà sách</li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h4>HỖ TRỢ</h4>
                        <ul>
                            <li>Chính sách đổi - trả - hoàn tiền</li>
                            <li>Chính sách bảo hành - bồi hoàn</li>
                            <li>Chính sách vận chuyển</li>
                            <li>Chính sách khách sỉ</li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h4>TÀI KHOẢN CỦA TÔI</h4>
                        <ul>
                            <li>Đăng nhập/Tạo mới tài khoản</li>
                            <li>Thay đổi địa chỉ khách hàng</li>
                            <li>Chi tiết tài khoản</li>
                            <li>Lịch sử mua hàng</li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h4>LIÊN HỆ</h4>
                        <div className={styles.contact}>
                            <div>
                                <EnvironmentOutlined />
                                <span> TP. HCM</span>
                            </div>
                            <div>
                                <MailOutlined />
                                <span> cskh@bookstore.com.vn</span>
                            </div>
                            <div>
                                <PhoneOutlined />
                                <span> 1900699999</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;