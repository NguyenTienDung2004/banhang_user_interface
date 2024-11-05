import styles from './crm.module.scss';
import classNames from 'classnames/bind';
import featureGroups from './featureGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
function CRM() {
    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Báo Cáo & Tính Năng Chính</h3>
            {featureGroups.map((featureGroup, index) => (
                <div className={cx('feature_group')} key={index}>
                    <div className={cx('feature_group_header')}>
                        <span className={cx('feature_group_icon')}>
                            <FontAwesomeIcon icon={faFileLines} />
                        </span>
                        <h3 className={cx('feature_group_title')}>{featureGroup.groupTitle}</h3>
                    </div>
                    <div className={cx('feature_list')}>
                        {featureGroup.featureList.map((feature, index) => (
                            <Link className={cx('feature_item')} key={index} to={feature.to}>
                                <span
                                    className={cx('feature_icon', {
                                        main_feature: feature.isMainFeature,
                                    })}
                                >
                                    <FontAwesomeIcon icon={faCircle} />
                                </span>
                                <h4 className={cx('feature_name')}>{feature.featureName}</h4>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CRM;
