import styles from './contractDetail.module.scss';
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
function ContractDetail() {
    const contextDataConsumer = useContext(contextData);
    const contentItem = contextDataConsumer.context.contentItem;
    const [contentItemState, setContentItemState] = useState(contentItem);
    const [staffList, setStaffList] = useState([]);
    const [customerList, setCustomerList] = useState([]);

    const inputPersonChargeRef = useRef();
    const tippyRef = useRef();
    const inputPartnerRef = useRef();
    const inputTermsContractRef = useRef();

    //get customer list
    async function getCustomerListFromAPI() {
        const response = await getService.getCustomerList();
        const data = response.sort((a, b) => {
            const lastNameA = a.ho_ten ? a.ho_ten.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ho_ten ? b.ho_ten.split(' ').slice(-1)[0] : '';
            return lastNameA.localeCompare(lastNameB);
        });
        setCustomerList(data);
    }

    // get customer by customer code
    function getCustomerByCode(customerCode) {
        const result = customerList.find((item) => item.ma_so === customerCode);
        return result;
    }

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
        getCustomerListFromAPI();
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

    //handle search customer
    const [customer, setCustomer] = useState();
    const [showCustomer, setShowCustomer] = useState(false);
    const [customerSearchResult, setCustomerSerchResult] = useState([]);
    let customerDebounced = useDebouce(customer, 300);
    useEffect(() => {
        customerDebounced = !customerDebounced ? '' : customerDebounced;
        const result = customerList.filter((item) => {
            return item.ma_so.toLowerCase().includes(customerDebounced.toLowerCase());
        });
        setCustomerSerchResult(result);
    }, [customerDebounced]);

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
                !contentItemState.loai_doi_tac
                    ? (contentItemState.loai_doi_tac = 'Danh sách khách hàng')
                    : (contentItemState.loai_doi_tac = contentItemState.loai_doi_tac);

                response = await createService.createNewContract(contentItemState);
            } else response = await updateService.updateContract(contentItem.id, contentItemState);

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
                    {Object.keys(contentItem).length === 0
                        ? 'Thêm hợp đồng'
                        : getCustomerByCode(contentItem.ten_doi_tac)
                        ? getCustomerByCode(contentItem.ten_doi_tac).ho_ten
                        : ''}
                </h2>
                <div className={cx({ feature_detailt_action_container: true })}>
                    <button
                        className={cx({
                            btn_save: true,
                        })}
                        onClick={() => {
                            if (
                                !inputPartnerRef.current.value &&
                                (contentItemState.ten_doi_tac === '' ||
                                    typeof contentItemState.ten_doi_tac === 'undefined' ||
                                    contentItemState.ten_doi_tac === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Đối tác');
                            } else if (
                                !inputTermsContractRef.current.value &&
                                (contentItemState.dieu_khoan_hop_dong === '' ||
                                    typeof contentItemState.dieu_khoan_hop_dong === 'undefined' ||
                                    contentItemState.dieu_khoan_hop_dong === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Điều khoản hợp đồng');
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
                            {/* partner type */}
                            <div className={cx({ input_item_container: true })}>
                                <label>Loại đối tác</label>
                                <select
                                    id="input_partnerType"
                                    value={
                                        contentItemState.loai_doi_tac
                                            ? contentItemState.loai_doi_tac
                                            : 'Danh sách khách hàng'
                                    }
                                    onChange={(e) => {
                                        setContentItemState({
                                            ...contentItemState,
                                            loai_doi_tac: e.target.value,
                                        });
                                    }}
                                >
                                    <option value="Danh sách khách hàng">Danh sách khách hàng</option>
                                </select>
                            </div>
                        </div>

                        <div className={cx({ two_col: true })}>
                            {/* partner code */}
                            <div className={cx({ input_item_container: true })}>
                                <label>Đối tác</label>
                                <HeadlessTippy
                                    interactive="true"
                                    visible={showCustomer}
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
                                                {customer
                                                    ? customerSearchResult.map((item) => (
                                                          <div
                                                              key={item.id}
                                                              className={cx({ select_input_item: true })}
                                                              onMouseDown={(e) => e.preventDefault()}
                                                              onClick={() => {
                                                                  inputPartnerRef.current.value = item.ma_so;
                                                                  setCustomer(item.ma_so);
                                                                  inputPartnerRef.current.blur();
                                                              }}
                                                          >
                                                              <h4 className={cx({ title: true })}>{item.ma_so}</h4>
                                                              <span className={cx({ sub_title: true })}>
                                                                  {item.ho_ten}
                                                              </span>
                                                          </div>
                                                      ))
                                                    : customerList.map((item) => (
                                                          <div
                                                              key={item.id}
                                                              className={cx({ select_input_item: true })}
                                                              onMouseDown={(e) => e.preventDefault()}
                                                              onClick={() => {
                                                                  inputPartnerRef.current.value = item.ma_so;
                                                                  setCustomer(item.ma_so);
                                                                  setContentItemState({
                                                                      ...contentItemState,
                                                                      ten_doi_tac: item.ma_so,
                                                                  });
                                                                  inputPartnerRef.current.blur();
                                                              }}
                                                          >
                                                              <h4 className={cx({ title: true })}>{item.ma_so}</h4>
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
                                        ref={inputPartnerRef}
                                        type="text"
                                        id="input_personCharge"
                                        autoComplete="off"
                                        value={
                                            typeof customer == 'undefined' && contentItemState.ten_doi_tac
                                                ? contentItemState.ten_doi_tac
                                                : !customer
                                                ? ''
                                                : customer
                                        }
                                        onChange={(e) => {
                                            if (!e.target.value.startsWith(' ')) {
                                                setCustomer(e.target.value === '' ? null : e.target.value);
                                            }
                                        }}
                                        onFocus={() => {
                                            setShowCustomer(true);
                                        }}
                                        onBlur={(e) => {
                                            setShowCustomer(false);
                                            const cus = customerList.find((item) => item.ma_so === e.target.value);
                                            if (cus) {
                                                setContentItemState({
                                                    ...contentItemState,
                                                    ten_doi_tac: cus.ma_so,
                                                });
                                            } else {
                                                setCustomer('');
                                                setContentItemState({
                                                    ...contentItemState,
                                                    ten_doi_tac: null,
                                                });
                                            }
                                        }}
                                    />
                                </HeadlessTippy>
                            </div>

                            {/* person charge */}
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
                                                    nguoi_phu_trach: staff.ma_nv,
                                                });
                                            } else {
                                                setPersonCharge('');
                                                setContentItemState({
                                                    ...contentItemState,
                                                    nguoi_phu_trach: null,
                                                });
                                            }
                                        }}
                                    />
                                </HeadlessTippy>
                            </div>
                        </div>
                    </div>
                </div>

                {/* group2 */}
                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Thời hạn hợp đồng</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_timeStart">Ngày bắt đầu</label>
                                <input
                                    type="date"
                                    id="input_timeStart"
                                    autoComplete="off"
                                    value={
                                        contentItemState.ngay_bat_dau
                                            ? contentItemState.ngay_bat_dau.substring(0, 10)
                                            : ''
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ngay_bat_dau: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_timeEnd">Ngày kết thúc</label>
                                <input
                                    type="date"
                                    id="input_timeEnd"
                                    autoComplete="off"
                                    value={
                                        contentItemState.ngay_ket_thuc
                                            ? contentItemState.ngay_ket_thuc.substring(0, 10)
                                            : ''
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ngay_ket_thuc: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* group 3 */}
                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Chi tiết hợp đồng</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ input_item_container: true })}>
                            <label htmlFor="input_TermsContract">Điều khoản hợp đồng</label>
                            <textarea
                                ref={inputTermsContractRef}
                                value={contentItemState.dieu_khoan_hop_dong ? contentItemState.dieu_khoan_hop_dong : ''}
                                onChange={(e) =>
                                    !e.target.value.startsWith(' ') &&
                                    setContentItemState({
                                        ...contentItemState,
                                        dieu_khoan_hop_dong: e.target.value === '' ? null : e.target.value,
                                    })
                                }
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContractDetail;
