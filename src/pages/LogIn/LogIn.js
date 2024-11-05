import styles from './login.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as getService from '~/apiService/getService';

const cx = classNames.bind(styles);
function LogIn({ setIsAuthenticate }) {
    const [titleBtnShowHide, setTitleBtnShowHide] = useState('Hiện');
    const inputPassRef = useRef();
    const inputUserNameRef = useRef();
    const navigate = useNavigate();
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        const getStaffListFromApi = async () => {
            const response = await getService.getStaff();
            setStaffList(response);
        };
        getStaffListFromApi();
    }, []);

    function handleShowHidePass() {
        inputPassRef.current.type === 'password'
            ? (inputPassRef.current.type = 'text')
            : (inputPassRef.current.type = 'password');
        titleBtnShowHide === 'Hiện' ? setTitleBtnShowHide('Ẩn') : setTitleBtnShowHide('Hiện');
    }

    function handleLogin() {
        const staff = staffList.find((staff) => {
            return (
                staff.ten_dang_nhap === inputUserNameRef.current.value && staff.mat_khau === inputPassRef.current.value
            );
        });

        if(staff){
            setIsAuthenticate(true);
            navigate('/');
        }
        else{
            alert('Tên đăng nhập hoặc mật khẩu không chính xác !')
        }
    }

    return (
        <form className={cx('wrapper')} onSubmit={handleLogin}>
            <div className={cx('content')}>
                <header className={cx('header')}>
                    <img src={images.logo} alt="logo" />
                    <h3 className={cx('header_title')}>Đăng nhập</h3>
                </header>
                <div className={cx('input_container')}>
                    <div className={cx('input_item')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faEnvelope} />
                        <input ref={inputUserNameRef} type="text" placeholder="Username" />
                    </div>
                    <div className={cx('input_item')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faLock} />
                        <input ref={inputPassRef} type="password" placeholder="Password" />
                        <span onClick={handleShowHidePass}>{titleBtnShowHide}</span>
                    </div>
                </div>
                <input type="submit" value="Đăng nhập" className={cx('btn_dang_nhap')} />
            </div>
        </form>
    );
}

export default LogIn;
