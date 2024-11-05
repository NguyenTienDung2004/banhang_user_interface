/* eslint-disable no-self-assign */
/* eslint-disable react-hooks/exhaustive-deps */
import styles from './customerListDetail.module.scss';
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
function CustomerListDetail() {
    const contextDataConsumer = useContext(contextData);
    const contentItem = contextDataConsumer.context.contentItem;
    const [contentItemState, setContentItemState] = useState(contentItem);
    const [staffList, setStaffList] = useState([]);
    const [potentialCustomerList, setPotentialCustomerList] = useState([]);
    const [opportunityList, setOpportunityList] = useState([]);
    const [fullname, setFullname] = useState();
    const [customerList, setCustomerList] = useState();
    const [payCurrency, setPaycurrency] = useState('VND');
    const [defaultPriceList, setDefaultPriceList] = useState('100000');
    const [nation, setNation] = useState();
    const [address, setAddress] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [email, setEmail] = useState();

    const inputPersonChargeRef = useRef();
    const inputPotentialCustomerRef = useRef();
    const tippyRef = useRef();
    const inputFullNameRef = useRef();
    const inputGroupCustomerRef = useRef();
    const inputNationRef = useRef();
    const inputCustomerCodeRef = useRef();
    const inputOpportunityRef = useRef();
    const inputPayCurrencyRef = useRef();
    const inputDefaultPriceListRef = useRef();
    const inputAddressRef = useRef();
    const inputPhoneNumberRef = useRef();
    const inputEmailAddressRef = useRef();

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

    //get opportunity list from api
    async function getOpportunityList() {
        const response = await getService.getOpportunity();
        const data = response.sort((a, b) => {
            const lastNameA = a.ten_khach_hang_tiem_nang ? a.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ten_khach_hang_tiem_nang ? b.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0] : '';
            return lastNameA.localeCompare(lastNameB);
        });
        setOpportunityList(data);
    }
    //get opportunity by customer code
    function getOpportunityListByCusCode(cusCode) {
        const result = opportunityList.filter((item) => item.doi_tac_dskh === cusCode);
        return result;
    }

    //get potential customer list from API
    async function getPotentialCustomerList() {
        const response = await getService.getPotentialCustomerList();
        const data = response.sort((a, b) => {
            const lastNameA = a.ten ? a.ten.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ten ? b.ten.split(' ').slice(-1)[0] : '';
            return lastNameA.localeCompare(lastNameB);
        });
        setPotentialCustomerList(data);
    }

    //get staff from codeStaff
    function getStaffByCode(codeStaff) {
        const result = staffList.find((item) => item.ma_nv === codeStaff);
        return result;
    }

    //get potential customer by code
    function getPotentialCustomerByCode(codePotentialCustomer) {
        const result = potentialCustomerList.find((item) => item.ma_so === codePotentialCustomer);
        return result;
    }

    //get customer list from api
    async function getCustomerListFromApi(params) {
        const response = await getService.getCustomerList();
        setCustomerList(response);
    }

    useEffect(() => {
        setContentItemState({
            ...contentItemState,
            ma_so: inputCustomerCodeRef.current.value,
        });

        getStaffList();
        getPotentialCustomerList();
        getOpportunityList();
        getCustomerListFromApi();
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

    //handle search potential customer
    const [potentialCustomer, setPotentialCustomer] = useState();
    const [showPotentialCustomer, setShowPotentialCustomer] = useState(false);
    const [potentialCustomerSearchResult, setPotentialCustomerSerchResult] = useState([]);
    let potentialCustomerDebounced = useDebouce(potentialCustomer ? potentialCustomer : '', 300);
    useEffect(() => {
        const result = potentialCustomerList.filter((item) => {
            return item.ma_so.toLowerCase().includes(potentialCustomerDebounced.toLowerCase());
        });
        setPotentialCustomerSerchResult(result);
    }, [potentialCustomerDebounced]);

    //handle search opportunity
    const [opportunity, setOpportunity] = useState();
    const [showOpportunity, setShowOpportunity] = useState(false);
    const [opportunitySearchResult, setOpportunitySerchResult] = useState([]);
    let opportunityDebounced = useDebouce(opportunity ? opportunity : '', 300);
    useEffect(() => {
        const result = opportunityList.filter((item) => {
            return item.ma_so.toLowerCase().includes(opportunityDebounced.toLowerCase());
        });
        setOpportunitySerchResult(result);
    }, [opportunityDebounced]);

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
                !contentItemState.loai
                    ? (contentItemState.loai = 'Công ty')
                    : // eslint-disable-next-line no-self-assign
                      (contentItemState.loai = contentItemState.loai);

                contentItemState.ho_ten = inputFullNameRef.current.value;
                contentItemState.tien_te_thanh_toan = inputPayCurrencyRef.current.value;
                contentItemState.bang_gia_mac_dinh = inputDefaultPriceListRef.current.value;
                contentItemState.quoc_gia = inputNationRef.current.value;
                contentItemState.dia_chi = inputAddressRef.current.value;
                contentItemState.email = inputEmailAddressRef.current.value;
                contentItemState.std = inputPhoneNumberRef.current.value;

                response = await createService.createNewCustomer(contentItemState);

                contextDataConsumer.setContext({
                    ...contextDataConsumer.context,
                    maxIdCustomer: contextDataConsumer.context.maxIdCustomer
                        ? contextDataConsumer.context.maxIdCustomer + 1
                        : customerList?.[customerList.length - 1]?.id + 1 || 1,
                });
            } else {
                response = await updateService.updateCustomer(contentItem.id, contentItemState);
                const updateOpporList = getOpportunityListByCusCode(contentItemState.ma_so).map((item) => {
                    return updateService.updateOpportunity(item.id, {
                        ...item,
                        ten_khach_hang_tiem_nang: contentItemState.ho_ten,
                        quoc_gia: contentItemState.quoc_gia,
                        dia_chi_khach_hang: contentItemState.dia_chi,
                        nhom_khach_hang: contentItemState.nhom_khach_hang,
                    });
                });
                await Promise.all(updateOpporList);
            }

            //update nguoc lai khtn ma no tham chieu toi
            if (inputPotentialCustomerRef.current) {
                if (getPotentialCustomerByCode(inputPotentialCustomerRef.current.value)) {
                    updateService.updatePotentialCustomer(
                        getPotentialCustomerByCode(inputPotentialCustomerRef.current.value).id,
                        {
                            ...getPotentialCustomerByCode(inputPotentialCustomerRef.current.value),
                            ten: fullname,
                            dia_chi_1: address,
                            dia_chi_email: email,
                            sdt: phoneNumber,
                            quoc_gia: nation,
                        },
                    );
                }
            }

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
                    {Object.keys(contentItem).length === 0 ? 'Thêm khách hàng' : contentItem.ho_ten}
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
                            } else if (
                                !inputGroupCustomerRef.current.value &&
                                (contentItemState.nhom_khach_hang === '' ||
                                    typeof contentItemState.nhom_khach_hang === 'undefined' ||
                                    contentItemState.nhom_khach_hang === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Nhóm khách hàng');
                            } else if (
                                !inputNationRef.current.value &&
                                (contentItemState.quoc_gia === '' ||
                                    typeof contentItemState.quoc_gia === 'undefined' ||
                                    contentItemState.quoc_gia === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Quốc gia');
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
                    <h2 className={cx({ input_group_title: true })}>Tên và loại</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_CustomerCode">Mã Khách hàng</label>
                                <input
                                    ref={inputCustomerCodeRef}
                                    readOnly
                                    type="text"
                                    id="input_CustomerCode"
                                    // readOnly
                                    autoComplete="off"
                                    value={
                                        contentItemState.ma_so
                                            ? contentItemState.ma_so
                                            : `KH-CUS-${contextDataConsumer.context.maxIdCustomer || 1}`
                                    }
                                    onChange={() => {}}
                                />
                            </div>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_fullname">Họ và tên</label>
                                <input
                                    ref={inputFullNameRef}
                                    type="text"
                                    id="input_fullname"
                                    autoComplete="off"
                                    value={
                                        inputPotentialCustomerRef.current && typeof fullname == 'undefined'
                                            ? getPotentialCustomerByCode(inputPotentialCustomerRef.current.value)
                                                ? getPotentialCustomerByCode(inputPotentialCustomerRef.current.value)
                                                      .ten
                                                : contentItemState.ho_ten
                                                ? contentItemState.ho_ten
                                                : ''
                                            : fullname
                                            ? fullname
                                            : ''
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ho_ten: e.target.value === '' ? null : e.target.value,
                                            });
                                        setFullname(e.target.value);
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label>Loại</label>
                                <select
                                    id="input_type"
                                    value={contentItemState.loai ? contentItemState.loai : 'Công ty'}
                                    onChange={(e) => {
                                        setContentItemState({
                                            ...contentItemState,
                                            loai: e.target.value,
                                        });
                                    }}
                                >
                                    <option value="Công ty">Công ty</option>
                                    <option value="Cá nhân">Cá nhân</option>
                                </select>
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_PAN">PAN</label>
                                <input
                                    type="text"
                                    id="input_PAN"
                                    autoComplete="off"
                                    value={contentItemState.pan ? contentItemState.pan : ``}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                pan: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_TaxDeductionList">Danh mục khấu trừ thuế</label>
                                <input
                                    type="text"
                                    id="input_TaxDeductionList"
                                    autoComplete="off"
                                    value={
                                        contentItemState.danh_muc_khau_tru_thue
                                            ? contentItemState.danh_muc_khau_tru_thue
                                            : ``
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                danh_muc_khau_tru_thue: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_DefaultBankAccount">Tài khoản ngân hàng công ty mặc định</label>
                                <input
                                    type="text"
                                    id="input_DefaultBankAccount"
                                    autoComplete="off"
                                    value={
                                        contentItemState.tai_khoan_ngan_hang ? contentItemState.tai_khoan_ngan_hang : ``
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                tai_khoan_ngan_hang: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            {/*potential customer */}
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_potentialCustomer">Khách hàng tiềm năng</label>
                                <HeadlessTippy
                                    interactive="true"
                                    visible={showPotentialCustomer}
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
                                                {potentialCustomer
                                                    ? potentialCustomerSearchResult.map((item) => (
                                                          <div
                                                              key={item.id}
                                                              className={cx({ select_input_item: true })}
                                                              onMouseDown={(e) => e.preventDefault()}
                                                              onClick={() => {
                                                                  inputPotentialCustomerRef.current.value = item.ma_so;
                                                                  setPotentialCustomer(item.ma_so);
                                                                  inputPotentialCustomerRef.current.blur();
                                                              }}
                                                          >
                                                              <h4 className={cx({ title: true })}>{item.ma_so}</h4>
                                                              <span className={cx({ sub_title: true })}>
                                                                  {item.ten}
                                                              </span>
                                                          </div>
                                                      ))
                                                    : potentialCustomerList.map((item) => (
                                                          <div
                                                              key={item.id}
                                                              className={cx({ select_input_item: true })}
                                                              onMouseDown={(e) => e.preventDefault()}
                                                              onClick={() => {
                                                                  inputPotentialCustomerRef.current.value = item.ma_so;
                                                                  setPotentialCustomer(item.ma_so);
                                                                  inputPotentialCustomerRef.current.blur();
                                                              }}
                                                          >
                                                              <h4 className={cx({ title: true })}>{item.ma_so}</h4>
                                                              <span className={cx({ sub_title: true })}>
                                                                  {item.ten}
                                                              </span>
                                                          </div>
                                                      ))}
                                            </PopUpWrapper>
                                        </div>
                                    )}
                                >
                                    <input
                                        ref={inputPotentialCustomerRef}
                                        type="text"
                                        id="input_potentialCustomer"
                                        autoComplete="off"
                                        value={
                                            typeof potentialCustomer == 'undefined' &&
                                            contentItemState.khach_hang_tiem_nang
                                                ? contentItemState.khach_hang_tiem_nang
                                                : !potentialCustomer
                                                ? ''
                                                : potentialCustomer
                                        }
                                        onChange={(e) => {
                                            if (!e.target.value.startsWith(' ')) {
                                                setPotentialCustomer(e.target.value === '' ? null : e.target.value);
                                            }
                                        }}
                                        onFocus={() => {
                                            setShowPotentialCustomer(true);
                                        }}
                                        onBlur={(e) => {
                                            setShowPotentialCustomer(false);
                                            console.log(e.target.value);
                                            const potentialCustomer = potentialCustomerList.find(
                                                (item) => item.ma_so === e.target.value,
                                            );

                                            if (potentialCustomer) {
                                                setContentItemState({
                                                    ...contentItemState,
                                                    khach_hang_tiem_nang: potentialCustomer.ma_so,
                                                    ho_ten: getPotentialCustomerByCode(potentialCustomer.ma_so)
                                                        ? getPotentialCustomerByCode(potentialCustomer.ma_so).ten
                                                        : '',
                                                });
                                                setFullname(
                                                    getPotentialCustomerByCode(potentialCustomer.ma_so)
                                                        ? getPotentialCustomerByCode(potentialCustomer.ma_so).ten
                                                        : '',
                                                );
                                                setAddress(
                                                    getPotentialCustomerByCode(potentialCustomer.ma_so)
                                                        ? getPotentialCustomerByCode(potentialCustomer.ma_so).dia_chi_1
                                                        : '',
                                                );
                                                setNation(
                                                    getPotentialCustomerByCode(potentialCustomer.ma_so)
                                                        ? getPotentialCustomerByCode(potentialCustomer.ma_so).quoc_gia
                                                        : '',
                                                );
                                                setPhoneNumber(
                                                    getPotentialCustomerByCode(potentialCustomer.ma_so)
                                                        ? getPotentialCustomerByCode(potentialCustomer.ma_so).sdt
                                                        : '',
                                                );
                                                setEmail(
                                                    getPotentialCustomerByCode(potentialCustomer.ma_so)
                                                        ? getPotentialCustomerByCode(potentialCustomer.ma_so).email
                                                        : '',
                                                );
                                            } else {
                                                setPersonCharge('');
                                                setContentItemState({
                                                    ...contentItemState,
                                                    khach_hang_tiem_nang: null,
                                                    ho_ten: null,
                                                });
                                                setFullname();
                                            }
                                        }}
                                    />
                                </HeadlessTippy>
                            </div>

                            {/* opportunity */}
                            <div className={cx({ input_item_container: true })}>
                                <label>Cơ hội</label>
                                <HeadlessTippy
                                    interactive="true"
                                    visible={showOpportunity}
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
                                                {opportunity
                                                    ? opportunitySearchResult.map((item) => (
                                                          <div
                                                              key={item.id}
                                                              className={cx({ select_input_item: true })}
                                                              onMouseDown={(e) => e.preventDefault()}
                                                              onClick={() => {
                                                                  inputOpportunityRef.current.value = item.ma_so;
                                                                  setOpportunity(item.ma_so);
                                                                  inputOpportunityRef.current.blur();
                                                              }}
                                                          >
                                                              <h4 className={cx({ title: true })}>{item.ma_so}</h4>
                                                              <span className={cx({ sub_title: true })}>
                                                                  {item.ten_khach_hang_tiem_nang}
                                                              </span>
                                                          </div>
                                                      ))
                                                    : opportunityList.map((item) => (
                                                          <div
                                                              key={item.id}
                                                              className={cx({ select_input_item: true })}
                                                              onMouseDown={(e) => e.preventDefault()}
                                                              onClick={() => {
                                                                  inputOpportunityRef.current.value = item.ma_so;
                                                                  setOpportunity(item.ma_so);
                                                                  inputOpportunityRef.current.blur();
                                                              }}
                                                          >
                                                              <h4 className={cx({ title: true })}>{item.ma_so}</h4>
                                                              <span className={cx({ sub_title: true })}>
                                                                  {item.ten_khach_hang_tiem_nang}
                                                              </span>
                                                          </div>
                                                      ))}
                                            </PopUpWrapper>
                                        </div>
                                    )}
                                >
                                    <input
                                        ref={inputOpportunityRef}
                                        type="text"
                                        id="input_personCharge"
                                        autoComplete="off"
                                        value={
                                            typeof opportunity == 'undefined' && contentItemState.loai_co_hoi
                                                ? contentItemState.loai_co_hoi
                                                : !opportunity
                                                ? ''
                                                : opportunity
                                        }
                                        onChange={(e) => {
                                            if (!e.target.value.startsWith(' ')) {
                                                setOpportunity(e.target.value === '' ? null : e.target.value);
                                            }
                                        }}
                                        onFocus={() => {
                                            setShowOpportunity(true);
                                        }}
                                        onBlur={(e) => {
                                            setShowOpportunity(false);
                                            console.log(e.target.value);
                                            const oppor = opportunityList.find((item) => item.ma_so === e.target.value);
                                            if (oppor) {
                                                setContentItemState({
                                                    ...contentItemState,
                                                    loai_co_hoi: oppor.ma_so,
                                                });
                                            } else {
                                                setOpportunity('');
                                                setContentItemState({
                                                    ...contentItemState,
                                                    loai_co_hoi: null,
                                                });
                                            }
                                        }}
                                    />
                                </HeadlessTippy>
                            </div>
                        </div>

                        <div className={cx({ two_col: true })}>
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
                                <label htmlFor="input_groupCustomer">Nhóm khách hàng</label>
                                <input
                                    ref={inputGroupCustomerRef}
                                    type="text"
                                    id="input_groupCustomer"
                                    autoComplete="off"
                                    value={contentItemState.nhom_khach_hang ? contentItemState.nhom_khach_hang : ``}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                nhom_khach_hang: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_Nation">Quốc gia</label>
                                <input
                                    ref={inputNationRef}
                                    type="text"
                                    id="input_Nation"
                                    autoComplete="off"
                                    value={
                                        inputPotentialCustomerRef.current && typeof nation == 'undefined'
                                            ? getPotentialCustomerByCode(inputPotentialCustomerRef.current.value)
                                                ? getPotentialCustomerByCode(inputPotentialCustomerRef.current.value)
                                                      .quoc_gia
                                                : contentItemState.quoc_gia
                                                ? contentItemState.quoc_gia
                                                : ''
                                            : nation
                                            ? nation
                                            : ''
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                quoc_gia: e.target.value === '' ? null : e.target.value,
                                            });
                                        setNation(e.target.value);
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_taxCode">Mã số thuế</label>
                                <input
                                    type="text"
                                    id="input_taxCode"
                                    autoComplete="off"
                                    value={contentItemState.ma_so_thue ? contentItemState.ma_so_thue : ``}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ma_so_thue: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_taxList">Danh mục thuế</label>
                                <input
                                    type="text"
                                    id="input_taxList"
                                    autoComplete="off"
                                    value={contentItemState.danh_muc_thue ? contentItemState.danh_muc_thue : ``}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                danh_muc_thue: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* group2 */}
                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Bảng giá và tiền</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_payCurrency">Tiền tệ thanh toán</label>
                                <input
                                    ref={inputPayCurrencyRef}
                                    type="text"
                                    id="input_payCurrency"
                                    autoComplete="off"
                                    value={
                                        contentItemState.tien_te_thanh_toan
                                            ? contentItemState.tien_te_thanh_toan
                                            : payCurrency
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                tien_te_thanh_toan: e.target.value === '' ? null : e.target.value,
                                            });
                                        setPaycurrency(e.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_defaultPriceList">Bảng giá mặc định</label>
                                <input
                                    ref={inputDefaultPriceListRef}
                                    type="text"
                                    id="input_defaultPriceList"
                                    autoComplete="off"
                                    value={
                                        contentItemState.bang_gia_mac_dinh
                                            ? contentItemState.bang_gia_mac_dinh
                                            : defaultPriceList
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                bang_gia_mac_dinh: e.target.value === '' ? null : e.target.value,
                                            });
                                        setDefaultPriceList(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Liên hệ</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_emailAddress">Địa chỉ Email</label>
                                <input
                                    ref={inputEmailAddressRef}
                                    type="text"
                                    id="input_emailAddress"
                                    autoComplete="off"
                                    value={
                                        inputPotentialCustomerRef.current && typeof email == 'undefined'
                                            ? getPotentialCustomerByCode(inputPotentialCustomerRef.current.value)
                                                ? getPotentialCustomerByCode(inputPotentialCustomerRef.current.value)
                                                      .dia_chi_email
                                                : contentItemState.email
                                                ? contentItemState.email
                                                : ''
                                            : email
                                            ? email
                                            : ''
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                email: e.target.value === '' ? null : e.target.value,
                                            });
                                        setEmail(e.target.value);
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_phoneNumber">Số điện thoại</label>
                                <input
                                    ref={inputPhoneNumberRef}
                                    type="text"
                                    id="input_phoneNumber"
                                    autoComplete="off"
                                    value={
                                        inputPotentialCustomerRef.current && typeof phoneNumber == 'undefined'
                                            ? getPotentialCustomerByCode(inputPotentialCustomerRef.current.value)
                                                ? getPotentialCustomerByCode(inputPotentialCustomerRef.current.value)
                                                      .sdt
                                                : contentItemState.sdt
                                                ? contentItemState.sdt
                                                : ''
                                            : phoneNumber
                                            ? phoneNumber
                                            : ''
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                sdt: e.target.value === '' ? null : e.target.value,
                                            });
                                        setPhoneNumber(e.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_address">Địa chỉ</label>
                                <input
                                    ref={inputAddressRef}
                                    type="text"
                                    id="input_address"
                                    autoComplete="off"
                                    value={
                                        inputPotentialCustomerRef.current && typeof address == 'undefined'
                                            ? getPotentialCustomerByCode(inputPotentialCustomerRef.current.value)
                                                ? getPotentialCustomerByCode(inputPotentialCustomerRef.current.value)
                                                      .dia_chi_1
                                                : contentItemState.dia_chi
                                                ? contentItemState.dia_chi
                                                : ''
                                            : address
                                            ? address
                                            : ''
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                dia_chi: e.target.value === '' ? null : e.target.value,
                                            });
                                        setAddress(e.target.value);
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

export default CustomerListDetail;
