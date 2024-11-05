import styles from './appointmentDetail.module.scss';
import classNames from 'classnames/bind';
import { contextData } from '~/component/ContextData/ContextData';
import { useContext, useRef, useState } from 'react';
import * as createService from '~/apiService/createService';
import * as updateService from '~/apiService/updateService';

const cx = classNames.bind(styles);
function AppointmentDetail() {
    const contextDataConsumer = useContext(contextData);
    const contentItem = contextDataConsumer.context.contentItem;
    const [contentItemState, setContentItemState] = useState(contentItem);

    const estimatedTimeRef = useRef();
    const inputNameRef = useRef();
    const inputEmailRef = useRef();

    // handle save
    async function handleSave() {
        try {
            let response;
            if (Object.keys(contentItem).length === 0) {
                !contentItemState.trang_thai
                    ? (contentItemState.trang_thai = 'Đang mở')
                    : (contentItemState.trang_thai = contentItemState.trang_thai);

                response = await createService.createNewAppointment(contentItemState);
            } else response = await updateService.updateAppointment(contentItem.id, contentItemState);

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
                    {Object.keys(contentItem).length === 0 ? 'Thêm cuộc hẹn' : contentItem.ho_ten}
                </h2>
                <div className={cx({ feature_detailt_action_container: true })}>
                    <button
                        className={cx({
                            btn_save: true,
                        })}
                        onClick={() => {
                            if (
                                !estimatedTimeRef.current.value &&
                                (contentItemState.thoi_gian_du_kien === '' ||
                                    typeof contentItemState.thoi_gian_du_kien === 'undefined' ||
                                    contentItemState.thoi_gian_du_kien === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Thời gian dự kiến');
                            } else if (
                                !inputNameRef.current.value &&
                                (contentItemState.ho_ten === '' ||
                                    typeof contentItemState.ho_ten === 'undefined' ||
                                    contentItemState.ho_ten === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Tên');
                            } else if (
                                !inputEmailRef.current.value &&
                                (contentItemState.email === '' ||
                                    typeof contentItemState.email === 'undefined' ||
                                    contentItemState.email === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Email');
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
                            <div
                                className={cx({
                                    input_item_container: true,
                                    a_center: true,
                                })}
                            >
                                <label htmlFor="input_Estimated_Time">Thời gian dự kiến</label>
                                <input
                                    ref={estimatedTimeRef}
                                    type="date"
                                    id="input_Estimated_Time"
                                    value={
                                        contentItemState.thoi_gian_du_kien
                                            ? contentItemState.thoi_gian_du_kien.substring(0, 10)
                                            : ''
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                thoi_gian_du_kien: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div
                                className={cx({
                                    input_item_container: true,
                                    a_center: true,
                                })}
                            >
                                <label htmlFor="input_status">Trạng thái</label>
                                <select
                                    id="input_status"
                                    value={contentItemState.trang_thai ? contentItemState.trang_thai : 'Thanh toán'}
                                    onChange={(e) => {
                                        setContentItemState({
                                            ...contentItemState,
                                            trang_thai: e.target.value,
                                        });
                                    }}
                                >
                                    <option value="Đang mở">Đang mở</option>
                                    <option value="Chưa được xác minh">Chưa được xác minh</option>
                                    <option value="Đã đóng">Đã đóng</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* group2 */}
                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Chi tiết khách hàng</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_namer">Tên</label>
                                <input
                                    ref={inputNameRef}
                                    type="text"
                                    id="input_namer"
                                    autoComplete="off"
                                    value={contentItemState.ho_ten ? contentItemState.ho_ten : ``}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ho_ten: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_phoneNumber">Số điện thoại</label>
                                <input
                                    type="text"
                                    id="input_phoneNumber"
                                    autoComplete="off"
                                    value={contentItemState.sdt ? contentItemState.sdt : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                sdt: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_id_skype">ID Skype</label>
                                <input
                                    type="text"
                                    id="input_id_skype"
                                    autoComplete="off"
                                    value={contentItemState.id_skype ? contentItemState.id_skype : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                id_skype: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_email">Email</label>
                                <input
                                    ref={inputEmailRef}
                                    type="text"
                                    id="input_email"
                                    autoComplete="off"
                                    value={contentItemState.email ? contentItemState.email : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                email: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>

                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="">Thông tin chi tiết</label>
                                <textarea
                                    value={
                                        contentItemState.thong_tin_chi_tiet ? contentItemState.thong_tin_chi_tiet : ''
                                    }
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
        </div>
    );
}

export default AppointmentDetail;
