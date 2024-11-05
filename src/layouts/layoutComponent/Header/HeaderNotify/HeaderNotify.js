import { faBell } from '@fortawesome/free-regular-svg-icons';
import HeadlessTippy from '@tippyjs/react/headless';
import styles from './headerNotify.module.scss'
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles)
function HeaderNotify() {
    return (
       <div>
            <HeadlessTippy
                visible
                interactive
                render={(attrs) => (
                    <div className={cx('notify_popup')}>
                    </div>
                )}
            >
                <div className={cx('notify')}>
                    <FontAwesomeIcon icon={faBell} className={cx('bell_icon')} />
                </div>
            </HeadlessTippy>
       </div>
    );
}

export default HeaderNotify;
