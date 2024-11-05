import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './featureItem.module.scss';

const cx = classNames.bind(styles);
function FeatureItem({ feature, input, setInputValue }) {
    return (
        <Link
            to={feature.featurePath}
            className={cx('wrapper')}
            onMouseDown={(e) => {
                e.preventDefault();
                setInputValue(feature.featureName);
            }}
            onClick={() => {
                input.blur();
            }}
        >
            <h3 className={cx('name')}>{feature.featureName}</h3>
        </Link>
    );
}

export default FeatureItem;
