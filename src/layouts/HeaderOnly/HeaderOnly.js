import Header from '~/layouts/layoutComponent/Header';
import styles from './headerOnly.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
function HeaderOnly({ children, data}) {    
    
    return (
        <div className={cx('wrapper')}>
            <Header data={data}/>
            <div className={cx('main_container')}>
                <div className={cx('content_container')}>{children}</div>
            </div>
        </div>
    );
}

export default HeaderOnly;
