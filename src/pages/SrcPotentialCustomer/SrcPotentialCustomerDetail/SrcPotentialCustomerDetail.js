import styles from './srcPotentialCustomerDetail.module.scss';
import classNames from 'classnames/bind';
import { contextData } from '~/component/ContextData/ContextData';
import { useContext, useRef, useState } from 'react';
import * as createService from '~/apiService/createService';
import * as updateService from '~/apiService/updateService';

const cx = classNames.bind(styles);
function SrcPotentialCustomerDetail() {
    const contextDataConsumer = useContext(contextData);
    const contentItem = contextDataConsumer.context.contentItem;
    const [contentItemState, setContentItemState] = useState(contentItem);

    const inputSrcNameRef = useRef();

    // handle save
    async function handleSave() {
        try {
            let response;
            if (Object.keys(contentItem).length === 0)
                response = await createService.createNewSrcPotentialCustomer(contentItemState);
            else response = await updateService.updateSrcPotentialCustomer(contentItem.id, contentItemState);

            alert('Success');
            console.log('Success:', response);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className={cx({ feature_detail_wrapper: true })}>
            {/* head page  */}
            <div className={cx({ feature_detail_header_wrapper: true })}>
                <h2 className={cx('title')}>
                    {Object.keys(contentItem).length === 0 ? 'Thêm nguồn khách hàng tiềm năng' : contentItem.ten_nguon}
                </h2>
                <div className={cx({ feature_detailt_action_container: true })}>
                    <button
                        className={cx({
                            btn_save: true,
                        })}
                        onClick={() => {
                            if (
                                !inputSrcNameRef.current.value &&
                                (contentItemState.ten_nguon === '' ||
                                    typeof contentItemState.ten_nguon === 'undefined' ||
                                    contentItemState.ten_nguon === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Tên nguồn');
                            } else {
                                handleSave();
                            }
                        }}
                    >
                        Lưu
                    </button>
                </div>
            </div>

            {/* content */}
            <div className={cx({ feature_detail_content: true })}>
                {/* group1 */}
                <div className={cx({ input_group: true })}>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_srcName">Tên nguồn</label>
                                <input
                                    ref={inputSrcNameRef}
                                    type="text"
                                    id="input_srcName"
                                    autoComplete="off"
                                    value={contentItemState.ten_nguon ? contentItemState.ten_nguon : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ten_nguon: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* group2 */}
                <div className={cx({ input_group: true })}>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ input_item_container: true })}>
                            <label htmlFor="">Thông tin chi tiết </label>
                            <textarea
                                value={contentItemState.thong_tin_chi_tiet ? contentItemState.thong_tin_chi_tiet : ''}
                                onChange={(e) => {
                                    !e.target.value.startsWith(' ') &&
                                        setContentItemState({
                                            ...contentItemState,
                                            thong_tin_chi_tiet: e.target.value === '' ? null : e.target.value,
                                        });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SrcPotentialCustomerDetail;
