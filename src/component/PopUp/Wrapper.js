import styles from './wrapper.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
function Wrapper({ children }) {
    return <div className={cx('wrapper')}>{children}</div>;
}

export default Wrapper;
