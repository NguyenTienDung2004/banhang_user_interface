import styles from './header.module.scss';
import images from '~/assets/images';
import HeaderSearch from '~/layouts/layoutComponent/Header/HeaderSearch';
import HeaderNotify from '~/layouts/layoutComponent/Header/HeaderNotify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { faAngleDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
function Header({data}) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content_container')}>
                <Link to="/" className={cx('side_left')}>
                    <img src={images.logo} alt="logo" />
                    <FontAwesomeIcon icon={faChevronRight} className={cx('icon')}/>
                    <h3 className={cx('title_page')}>{data.titlePage}</h3>
                </Link>
                <div className={cx('side_right')}>
                    <HeaderSearch />

                    <div className={cx('action')}>
                        
                        <HeaderNotify />

                        <div className={cx('vertical_line')}></div>

                        <div className={cx('help')}>
                            <span>Trợ giúp</span>
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>

                        <div className={cx('avatar')}>
                            <img src={images.defaultAvatar} alt="avatar" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
