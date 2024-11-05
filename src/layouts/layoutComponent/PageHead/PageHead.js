import styles from './pageHead.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
function PageHead({ data }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content_container')}>
                <h2 className={cx('title')}>{data.titlePage}</h2>
                <div className={cx('action_container')}></div>
            </div>
        </div>
    );
}

export default PageHead;
