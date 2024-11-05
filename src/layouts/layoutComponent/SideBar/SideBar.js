import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './sideBar.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import ModuleGroups from '~/moduleList';
import { useState } from 'react';

const cx = classNames.bind(styles);
function SideBar() {
    const [moduleActive, setModuleActive] = useState(5);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content_container')}>
                {ModuleGroups.map((moduleGroup, index) => {
                    return (
                        <div className={cx('module_group')} key={index}>
                            <h4 className={cx('module_group_title')}>{moduleGroup.titleModuleGroup}</h4>
                            {moduleGroup.listModuleItem.map((moduleItem) => {
                                return (
                                    <Link
                                        className={cx('module_item', {
                                            active: moduleActive === moduleItem.id,
                                        })}
                                        key={moduleItem.id}
                                        to={moduleItem.modulePath}
                                        onClick={() => setModuleActive(moduleItem.id)}
                                    >
                                        <span className={cx('module_icon')}>{moduleItem.moduleIcon}</span>
                                        <h4 className={cx('module_name')}>{moduleItem.moduleName}</h4>
                                    </Link>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SideBar;
