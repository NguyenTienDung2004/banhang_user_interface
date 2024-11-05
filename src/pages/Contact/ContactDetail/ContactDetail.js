import styles from './contactDetail.module.scss';
import classNames from 'classnames/bind';
import { contextData } from '~/component/ContextData/ContextData';
import { useContext, useEffect, useRef, useState } from 'react';
import { PopUpWrapper } from '~/component/PopUp';
import HeadlessTippy from '@tippyjs/react/headless';
import * as createService from '~/apiService/createService';
import * as updateService from '~/apiService/updateService';
import * as getService from '~/apiService/getService';
import useDebouce from '~/hooks/useDebounce';

const cx = classNames.bind(styles);
function ContactDetail() {
    const contextDataConsumer = useContext(contextData);
    const contentItem = contextDataConsumer.context.contentItem;
    const [contentItemState, setContentItemState] = useState(contentItem);
    const [staffList, setStaffList] = useState([]);

    const inputPersonChargeRef = useRef();
    const tippyRef = useRef();
    const inputFullNameRef = useRef();

    //get staff list from api
    async function getStaffList() {
        const response = await getService.getStaff();
        const data = response.sort((a, b) => {
            const lastNameA = a.ho_ten ? a.ho_ten.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ho_ten ? b.ho_ten.split(' ').slice(-1)[0] : '';
            return lastNameA.localeCompare(lastNameB);
        });
        setStaffList(data);
    }

    //get staff from codeStaff
    function getStaffByCode(codeStaff) {
        const result = staffList.find((item) => item.ma_nv === codeStaff);
        return result;
    }

    useEffect(() => {
        getStaffList();
    }, []);

    //handle search person charge
    const [personCharge, setPersonCharge] = useState();
    const [showPersonCharge, setShowPersonCharge] = useState(false);
    const [personChargeSearchResult, setPersonChargeSerchResult] = useState([]);
    let personChargeDebounced = useDebouce(personCharge, 300);
    useEffect(() => {
        personChargeDebounced = !personChargeDebounced ? '' : personChargeDebounced;
        const result = staffList.filter((staff) => {
            return staff.email.toLowerCase().includes(personChargeDebounced.toLowerCase());
        });
        setPersonChargeSerchResult(result);
    }, [personChargeDebounced]);

    //handle the width of the tippies to match their input
    useEffect(() => {
        const handleResize = () => {
            tippyRef.current.style.width = inputPersonChargeRef.current.offsetWidth + 'px';
        };
        window.addEventListener('resize', handleResize);

        // Cleanup event listener khi component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // handle save
    async function handleSave() {
        try {
            let response;
            if (Object.keys(contentItem).length === 0) {
                !contentItemState.trang_thai
                    ? (contentItemState.trang_thai = 'Thụ động')
                    : (contentItemState.trang_thai = contentItemState.trang_thai);

                !contentItemState.gioi_tinh
                    ? (contentItemState.gioi_tinh = 'Nam')
                    : (contentItemState.gioi_tinh = contentItemState.gioi_tinh);

                response = await createService.createNewContact(contentItemState);
            } else response = await updateService.updateContact(contentItem.id, contentItemState);

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
                    {Object.keys(contentItem).length === 0 ? 'Thêm liên lạc' : contentItem.ho_ten}
                </h2>
                <div className={cx({ feature_detailt_action_container: true })}>
                    <button
                        className={cx({
                            btn_save: true,
                        })}
                        onClick={() => {
                            if (
                                !inputFullNameRef.current.value &&
                                (contentItemState.ho_ten === '' ||
                                    typeof contentItemState.ho_ten === 'undefined' ||
                                    contentItemState.ho_ten === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Họ và tên');
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
                                <label htmlFor="input_fullname">Họ và tên</label>
                                <input
                                    ref={inputFullNameRef}
                                    type="text"
                                    id="input_fullname"
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
                                <label>Người phụ trách</label>
                                <HeadlessTippy
                                    interactive="true"
                                    visible={showPersonCharge}
                                    placement="bottom"
                                    render={(attrs) => (
                                        <div
                                            ref={tippyRef}
                                            className={cx({ select_input: true })}
                                            tabIndex="-1"
                                            {...attrs}
                                            style={{
                                                width: inputPersonChargeRef.current.offsetWidth + 'px',
                                            }}
                                        >
                                            <PopUpWrapper>
                                                {personCharge
                                                    ? personChargeSearchResult.map((item) => (
                                                          <div
                                                              key={item.id}
                                                              className={cx({ select_input_item: true })}
                                                              onMouseDown={(e) => e.preventDefault()}
                                                              onClick={() => {
                                                                  inputPersonChargeRef.current.value = item.email;
                                                                  setPersonCharge(item.email);
                                                                  inputPersonChargeRef.current.blur();
                                                              }}
                                                          >
                                                              <h4 className={cx({ title: true })}>{item.email}</h4>
                                                              <span className={cx({ sub_title: true })}>
                                                                  {item.ho_ten}
                                                              </span>
                                                          </div>
                                                      ))
                                                    : staffList.map((item) => (
                                                          <div
                                                              key={item.id}
                                                              className={cx({ select_input_item: true })}
                                                              onMouseDown={(e) => e.preventDefault()}
                                                              onClick={() => {
                                                                  inputPersonChargeRef.current.value = item.email;
                                                                  setPersonCharge(item.email);
                                                                  inputPersonChargeRef.current.blur();
                                                              }}
                                                          >
                                                              <h4 className={cx({ title: true })}>{item.email}</h4>
                                                              <span className={cx({ sub_title: true })}>
                                                                  {item.ho_ten}
                                                              </span>
                                                          </div>
                                                      ))}
                                            </PopUpWrapper>
                                        </div>
                                    )}
                                >
                                    <input
                                        ref={inputPersonChargeRef}
                                        type="text"
                                        id="input_personCharge"
                                        autoComplete="off"
                                        value={
                                            typeof personCharge == 'undefined' &&
                                            getStaffByCode(contentItemState.nguoi_quan_li)
                                                ? getStaffByCode(contentItemState.nguoi_quan_li).email
                                                : !personCharge
                                                ? ''
                                                : personCharge
                                        }
                                        onChange={(e) => {
                                            if (!e.target.value.startsWith(' ')) {
                                                setPersonCharge(e.target.value === '' ? null : e.target.value);
                                            }
                                        }}
                                        onFocus={() => {
                                            setShowPersonCharge(true);
                                        }}
                                        onBlur={(e) => {
                                            setShowPersonCharge(false);
                                            console.log(e.target.value);
                                            const staff = staffList.find((item) => item.email === e.target.value);
                                            if (staff) {
                                                setContentItemState({
                                                    ...contentItemState,
                                                    nguoi_quan_li: staff.ma_nv,
                                                });
                                            } else {
                                                setPersonCharge('');
                                                setContentItemState({
                                                    ...contentItemState,
                                                    nguoi_quan_li: null,
                                                });
                                            }
                                        }}
                                    />
                                </HeadlessTippy>
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_address">Địa chỉ</label>
                                <input
                                    type="text"
                                    id="input_address"
                                    autoComplete="off"
                                    value={contentItemState.dia_chi ? contentItemState.dia_chi : ``}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                dia_chi: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>

                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label>Trạng thái</label>
                                <select
                                    id="input_state"
                                    value={contentItemState.trang_thai ? contentItemState.trang_thai : 'Thụ động'}
                                    onChange={(e) => {
                                        setContentItemState({
                                            ...contentItemState,
                                            trang_thai: e.target.value,
                                        });
                                    }}
                                >
                                    <option value="Thụ động">Thụ động</option>
                                    <option value="Đang mở">Đang mở</option>
                                    <option value="Đã phản hồi">Đã phản hồi</option>
                                </select>
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_formAddress">Xưng hô</label>
                                <input
                                    type="text"
                                    id="input_formAddress"
                                    autoComplete="off"
                                    value={contentItemState.xung_ho ? contentItemState.xung_ho : ``}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                xung_ho: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_title">Chức danh</label>
                                <input
                                    type="text"
                                    id="input_title"
                                    autoComplete="off"
                                    value={contentItemState.chuc_danh ? contentItemState.chuc_danh : ``}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                chuc_danh: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label>Giới tính</label>
                                <select
                                    value={contentItemState.gioi_tinh ? contentItemState.gioi_tinh : 'Nam'}
                                    onChange={(e) => {
                                        setContentItemState({
                                            ...contentItemState,
                                            gioi_tinh: e.target.value,
                                        });
                                    }}
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_companyName">Tên công ty</label>
                                <input
                                    type="text"
                                    id="input_companyName"
                                    autoComplete="off"
                                    value={contentItemState.ten_cong_ty ? contentItemState.ten_cong_ty : ``}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ten_cong_ty: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* group2 */}
                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Thông tin liên lạc</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_emailAdress">Địa chỉ Email</label>
                                <input
                                    type="text"
                                    id="input_emailAdress"
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

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_mobilePhone">Số điện thoại</label>
                                <input
                                    type="text"
                                    id="input_mobilePhone"
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactDetail;
