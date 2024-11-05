import Header from '~/layouts/layoutComponent/Header';
import SideBar from '~/layouts/layoutComponent/SideBar';
import PageHead from '~/layouts/layoutComponent/PageHead';
import styles from './mainLayout.module.scss';

import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
function MainLayout({ children, data }) {
    return (
        <div className={cx('wrapper')}>
            <Header data={data} />
            <PageHead data={data} />
            <div className={cx('main_container')}>
                <SideBar />
                <div className={cx('content_container')}>{children}</div>
            </div>
        </div>
    );
}

export default MainLayout;
