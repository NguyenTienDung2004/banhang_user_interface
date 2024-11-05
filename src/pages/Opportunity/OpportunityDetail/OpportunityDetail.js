/* eslint-disable no-self-assign */
/* eslint-disable react-hooks/exhaustive-deps */
import styles from './opportunityDetail.module.scss';
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
function OpportunityDetail() {
    const contextDataConsumer = useContext(contextData);
    const contentItem = contextDataConsumer.context.contentItem;
    const [contentItemState, setContentItemState] = useState(contentItem);
    const [staffList, setStaffList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [potentialCustomerList, setPotentialCustomerList] = useState([]);
    const [sourceList, setSourceList] = useState([]);
    const [address, setAddress] = useState();
    const [nation, setNation] = useState();
    const [customerGroup, setCustomerGroup] = useState();
    const [opportunityList, setOpportunityList] = useState();
    const [currencyUnit, setCurrencyUnit] = useState('VND');
    const [opportunityMoney, setOpportunityMoney] = useState('0');
    const [probability, setProbability] = useState('100');

    const inputOppotunityFromRef = useRef();
    const inputPersonChargeref = useRef();
    const inputSourceRef = useRef();
    const tippyRef = useRef();
    const inputCodePotentialCustomerRef = useRef();
    const inputPartnerRef = useRef();
    const inputPartnerNameRef = useRef();
    const inputNextContactByRef = useRef();
    const inputAddressRef = useRef();
    const inputNationRef = useRef();
    const inputCurrencyUnitRef = useRef();
    const inputOpportunityMoneyRef = useRef();
    const inputProbabillityRef = useRef();
    const inputCustomerGroupRef = useRef();

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

    //get customer list from API
    async function getCustomerList() {
        const response = await getService.getCustomerList();
        const data = response.sort((a, b) => {
            const lastNameA = a.ho_ten ? a.ho_ten.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ho_ten ? b.ho_ten.split(' ').slice(-1)[0] : '';
            return lastNameA.localeCompare(lastNameB);
        });
        setCustomerList(data);
    }

    //get potential customer list from api
    async function getPotentialCustomerList() {
        const response = await getService.getPotentialCustomerList();
        const data = response.sort((a, b) => {
            const lastNameA = a.ten ? a.ten.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ten ? b.ten.split(' ').slice(-1)[0] : '';
            return lastNameA.localeCompare(lastNameB);
        });
        setPotentialCustomerList(data);
    }

    // get source list from API
    async function getSourceList() {
        const response = await getService.getSrcPotentialCustomer();
        const data = response.sort((a, b) => {
            const lastNameA = a.ten_nguon ? a.ten_nguon.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ten_nguon ? b.ten_nguon.split(' ').slice(-1)[0] : '';
            return lastNameA.localeCompare(lastNameB);
        });
        setSourceList(data);
    }

    //get staff by codeStaff
    function getStaffByCode(codeStaff) {
        const result = staffList.find((item) => item.ma_nv === codeStaff);
        return result;
    }

    //get customer by customercode
    function getCustomerByCode(customerCode) {
        const result = customerList.find((item) => item.ma_so === customerCode);
        return result;
    }

    //get potential customer by potentical customer code
    function getPotentialCustomerByCode(potentialCustomerCode) {
        const result = potentialCustomerList.find((item) => item.ma_so === potentialCustomerCode);
        return result;
    }

    //get source by id
    function getSourceById(id) {
        const result = sourceList.find((item) => item.id === id);
        return result;
    }

    //get opportunity list from api
    async function getOpportunityList() {
        const response = await getService.getOpportunity();
        setOpportunityList(response);
    }

    useEffect(() => {
        setContentItemState({
            ...contentItemState,
            ma_so: inputCodePotentialCustomerRef.current.value,
        });
        getStaffList();
        getCustomerList();
        getPotentialCustomerList();
        getSourceList();
        getOpportunityList();
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

    //handle search next contact by
    const [nextContactBy, setNextContactBy] = useState();
    const [showNextContactBy, setShowNextContactBy] = useState(false);
    const [nextContactBySearchResult, setNextContactBySerchResult] = useState([]);
    let nextContactByDebounced = useDebouce(nextContactBy, 300);
    useEffect(() => {
        nextContactByDebounced = !nextContactByDebounced ? '' : nextContactByDebounced;
        const result = staffList.filter((staff) => {
            return staff.email.toLowerCase().includes(nextContactByDebounced.toLowerCase());
        });
        setNextContactBySerchResult(result);
    }, [nextContactByDebounced]);

    //handle search customer list
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

    //handle search potential customer list
    const [potentialcustomer, setPotentialCustomer] = useState();
    const [showPotentialCustomer, setShowPotentialCustomer] = useState(false);
    const [potentialcustomerSearchResult, setPotentialCustomerSerchResult] = useState([]);
    let potentialcustomerDebounced = useDebouce(potentialcustomer, 300);
    useEffect(() => {
        potentialcustomerDebounced = !potentialcustomerDebounced ? '' : potentialcustomerDebounced;
        const result = customerList.filter((item) => {
            return item.ma_so.toLowerCase().includes(potentialcustomerDebounced.toLowerCase());
        });
        setPotentialCustomerSerchResult(result);
    }, [potentialcustomerDebounced]);

    //handle search source
    const [source, setSource] = useState();
    const [showSource, setShowSource] = useState(false);
    const [sourceSearchResult, setSourceSearchResult] = useState([]);
    let sourceDebounced = useDebouce(source, 300);
    useEffect(() => {
        sourceDebounced = !sourceDebounced ? '' : sourceDebounced;
        const result = sourceList.filter((source) => {
            return source.ten_nguon.toLowerCase().includes(sourceDebounced.toLowerCase());
        });
        setSourceSearchResult(result);
    }, [sourceDebounced]);

    //handle the width of the tippies to match their input
    useEffect(() => {
        const handleResize = () => {
            tippyRef.current.style.width = inputPersonChargeref.current.offsetWidth + 'px';
        };
        window.addEventListener('resize', handleResize);

        // Cleanup event listener khi component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //handle save
    async function handleSave() {
        try {
            let response;
            contentItemState.dia_chi_khach_hang = inputAddressRef.current.value;
            contentItemState.don_vi_tien_te = inputCurrencyUnitRef.current.value;
            contentItemState.quoc_gia = inputNationRef.current.value;
            contentItemState.so_tien_co_hoi = inputOpportunityMoneyRef.current.value;
            contentItemState.xac_suat = inputProbabillityRef.current.value;
            if (inputOppotunityFromRef.current.value === 'Danh sách khách hàng') {
                contentItemState.doi_tac_khtn = null;
                contentItemState.nhom_khach_hang = inputCustomerGroupRef.current.value;
            } else {
                contentItemState.doi_tac_dskh = null;
            }

            // Set default values if not provided
            if (Object.keys(contentItem).length === 0) {
                contentItemState.trang_thai = contentItemState.trang_thai || 'Đang mở';
                contentItemState.co_hoi_den_tu = contentItemState.co_hoi_den_tu || 'Danh sách khách hàng';
                contentItemState.gioi_tinh = contentItemState.gioi_tinh || 'Nam';
                contentItemState.loai_dia_chi = contentItemState.loai_dia_chi || 'Thanh toán';

                response = await createService.createNewOpportunity(contentItemState);

                contextDataConsumer.setContext({
                    ...contextDataConsumer.context,
                    maxIdOpportunity: contextDataConsumer.context.maxIdOpportunity
                        ? contextDataConsumer.context.maxIdOpportunity + 1
                        : opportunityList?.[opportunityList.length - 1]?.id + 1 || 1,
                });
            } else {
                response = await updateService.updateOpportunity(contentItem.id, contentItemState);
            }

            // Update address, nation, and customer group based on inputOppotunityFromRef
            if (inputOppotunityFromRef.current) {
                const isCustomerList = inputOppotunityFromRef.current.value === 'Danh sách khách hàng';
                const partnerCode = inputPartnerRef.current.value;
                if (isCustomerList) {
                    const customer = getCustomerByCode(partnerCode);
                    if (customer) {
                        const pcus = getPotentialCustomerByCode(customer.khach_hang_tiem_nang);
                        if (pcus) {
                            updateService.updatePotentialCustomer(pcus.id, {
                                ...pcus,
                                dia_chi_1: address,
                                quoc_gia: nation,
                            });
                        }
                        updateService.updateCustomer(customer.id, {
                            ...customer,
                            nhom_khach_hang: customerGroup,
                        });
                    }
                } else {
                    const potentialCustomer = getPotentialCustomerByCode(partnerCode);
                    if (potentialCustomer) {
                        updateService.updatePotentialCustomer(potentialCustomer.id, {
                            ...potentialCustomer,
                            dia_chi_1: address,
                            quoc_gia: nation,
                        });
                    }
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
                    {Object.keys(contentItem).length === 0 ? 'Thêm cơ hội' : contentItem.ten_khach_hang_tiem_nang}
                </h2>
                <div className={cx({ feature_detailt_action_container: true })}>
                    <button
                        className={cx({
                            btn_save: true,
                        })}
                        onClick={() => {
                            if (
                                !inputOppotunityFromRef.current.value &&
                                (contentItemState.co_hoi_den_tu === '' ||
                                    typeof contentItemState.co_hoi_den_tu === 'undefined' ||
                                    contentItemState.co_hoi_den_tu === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Cơ hội đến từ');
                            } else if (
                                !inputPartnerRef.current.value &&
                                ((contentItemState.doi_tac_khtn === '' && contentItemState.doi_tac_dskh === '') ||
                                    (typeof contentItemState.doi_tac_khtn === 'undefined' &&
                                        typeof contentItemState.doi_tac_dskh === 'undefined') ||
                                    (contentItemState.doi_tac_khtn === null && contentItemState.doi_tac_dskh === null))
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Đối tác');
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
                                <label htmlFor="input_opportunityCode">Mã cơ hội</label>
                                <input
                                    ref={inputCodePotentialCustomerRef}
                                    readOnly
                                    type="text"
                                    id="input_opportunityCode"
                                    autoComplete="off"
                                    value={
                                        contentItemState.ma_so
                                            ? contentItemState.ma_so
                                            : `CH-OPP-${contextDataConsumer.context.maxIdOpportunity || 1}`
                                    }
                                    onChange={() => {}}
                                />
                            </div>

                            {/* opportunity from */}
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_oppotunityFrom">Cơ hôị từ</label>
                                <select
                                    ref={inputOppotunityFromRef}
                                    id="input_oppotunityFrom"
                                    value={
                                        contentItemState.co_hoi_den_tu
                                            ? contentItemState.co_hoi_den_tu
                                            : 'Danh sách khách hàng'
                                    }
                                    onChange={(e) => {
                                        contentItemState.doi_tac_khtn = null;
                                        contentItemState.doi_tac_dskh = null;
                                        inputPartnerRef.current.value = null;
                                        setCustomer('');
                                        setPotentialCustomer('');
                                        setContentItemState({
                                            ...contentItemState,
                                            co_hoi_den_tu: e.target.value,
                                            doi_tac_khtn: null,
                                            doi_tac_dskh: null,
                                        });
                                    }}
                                >
                                    <option value="Danh sách khách hàng">Danh sách khách hàng</option>
                                    <option value="Khách hàng tiềm năng">Khách hàng tiềm năng</option>
                                </select>
                            </div>

                            {/* partner */}
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_partner">Đối tác</label>

                                <HeadlessTippy
                                    interactive="true"
                                    visible={
                                        inputOppotunityFromRef.current
                                            ? inputOppotunityFromRef.current.value === 'Danh sách khách hàng'
                                                ? showCustomer
                                                : showPotentialCustomer
                                            : false
                                    }
                                    placement="bottom"
                                    render={(attrs) => (
                                        <div
                                            ref={tippyRef}
                                            className={cx({ select_input: true })}
                                            tabIndex="-1"
                                            {...attrs}
                                            style={{
                                                width: inputPersonChargeref.current.offsetWidth + 'px',
                                            }}
                                        >
                                            <PopUpWrapper>
                                                {inputOppotunityFromRef.current.value === 'Danh sách khách hàng'
                                                    ? customer
                                                        ? customerSearchResult.map((item) => (
                                                              <div
                                                                  key={item.id}
                                                                  className={cx({ select_input_item: true })}
                                                                  onMouseDown={(e) => e.preventDefault()}
                                                                  onClick={() => {
                                                                      inputPartnerRef.current.value = item.ma_so;
                                                                      setCustomer(item.email);
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
                                                                      setCustomer(item.email);
                                                                      inputPartnerRef.current.blur();
                                                                  }}
                                                              >
                                                                  <h4 className={cx({ title: true })}>{item.ma_so}</h4>
                                                                  <span className={cx({ sub_title: true })}>
                                                                      {item.ho_ten}
                                                                  </span>
                                                              </div>
                                                          ))
                                                    : potentialcustomer
                                                    ? potentialcustomerSearchResult.map((item) => (
                                                          <div
                                                              key={item.id}
                                                              className={cx({ select_input_item: true })}
                                                              onMouseDown={(e) => e.preventDefault()}
                                                              onClick={() => {
                                                                  inputPartnerRef.current.value = item.ma_so;
                                                                  setPotentialCustomer(item.email);
                                                                  inputPartnerRef.current.blur();
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
                                                                  inputPartnerRef.current.value = item.ma_so;
                                                                  setPotentialCustomer(item.email);
                                                                  inputPartnerRef.current.blur();
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
                                        ref={inputPartnerRef}
                                        type="text"
                                        id="input_partner"
                                        autoComplete="off"
                                        value={
                                            inputOppotunityFromRef.current
                                                ? inputOppotunityFromRef.current.value === 'Danh sách khách hàng'
                                                    ? typeof customer == 'undefined' && contentItemState.doi_tac_dskh
                                                        ? contentItemState.doi_tac_dskh
                                                        : customer || ''
                                                    : typeof potentialcustomer == 'undefined' &&
                                                      contentItemState.doi_tac_khtn
                                                    ? contentItemState.doi_tac_khtn
                                                    : potentialcustomer || ''
                                                : ''
                                        }
                                        onChange={(e) => {
                                            if (!e.target.value.startsWith(' ')) {
                                                if (inputOppotunityFromRef.current.value === 'Danh sách khách hàng') {
                                                    setCustomer(e.target.value === '' ? null : e.target.value);
                                                } else {
                                                    setPotentialCustomer(e.target.value === '' ? null : e.target.value);
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            if (inputOppotunityFromRef.current.value === 'Danh sách khách hàng') {
                                                setShowCustomer(true);
                                            } else {
                                                setShowPotentialCustomer(true);
                                            }
                                        }}
                                        onBlur={(e) => {
                                            const trimmedValue = e.target.value.trim();
                                            console.log(trimmedValue);
                                            if (inputOppotunityFromRef.current.value === 'Danh sách khách hàng') {
                                                setShowCustomer(false);
                                                const cus = customerList.find(
                                                    (item) => item.ma_so === e.target.value.trim(),
                                                );
                                                if (cus) {
                                                    setContentItemState({
                                                        ...contentItemState,
                                                        doi_tac_dskh: cus.ma_so,
                                                        doi_tac_khtn: null,
                                                        ten_khach_hang_tiem_nang: getCustomerByCode(cus.ma_so).ho_ten,
                                                    });
                                                    setCustomer(cus.ma_so);
                                                } else {
                                                    setCustomer('');
                                                    setContentItemState({
                                                        ...contentItemState,
                                                        doi_tac_dskh: null,
                                                        doi_tac_khtn: null,
                                                        ten_khach_hang_tiem_nang: null,
                                                    });
                                                }
                                            } else {
                                                setShowPotentialCustomer(false);
                                                const pcus = potentialCustomerList.find(
                                                    (item) => item.ma_so === e.target.value.trim(),
                                                );
                                                if (pcus) {
                                                    setContentItemState({
                                                        ...contentItemState,
                                                        doi_tac_khtn: pcus.ma_so,
                                                        doi_tac_dskh: null,
                                                        ten_khach_hang_tiem_nang: getPotentialCustomerByCode(pcus.ma_so)
                                                            .ten,
                                                    });
                                                    setPotentialCustomer(pcus.ma_so);
                                                } else {
                                                    setPotentialCustomer('');
                                                    setContentItemState({
                                                        ...contentItemState,
                                                        doi_tac_khtn: null,
                                                        doi_tac_dskh: null,
                                                        ten_khach_hang_tiem_nang: null,
                                                    });
                                                }
                                            }
                                        }}
                                    />
                                </HeadlessTippy>
                            </div>

                            {/* name partner */}
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_name">Tên khách hàng / tiềm năng</label>
                                <input
                                    ref={inputPartnerNameRef}
                                    type="text"
                                    id="input_name"
                                    autoComplete="off"
                                    readOnly
                                    value={
                                        inputOppotunityFromRef.current
                                            ? inputOppotunityFromRef.current.value === 'Danh sách khách hàng'
                                                ? getCustomerByCode(inputPartnerRef.current.value)
                                                    ? getCustomerByCode(inputPartnerRef.current.value).ho_ten
                                                    : ''
                                                : getPotentialCustomerByCode(inputPartnerRef.current.value)
                                                ? getPotentialCustomerByCode(inputPartnerRef.current.value).ten
                                                : ''
                                            : ''
                                    }
                                />
                            </div>

                            {/* SOURCE */}
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_source">Nguồn</label>
                                <HeadlessTippy
                                    interactive="true"
                                    visible={showSource}
                                    placement="bottom"
                                    render={(attrs) => (
                                        <div
                                            ref={tippyRef}
                                            className={cx({ select_input: true })}
                                            tabIndex="-1"
                                            {...attrs}
                                            style={{
                                                width: inputPersonChargeref.current.offsetWidth + 'px',
                                            }}
                                        >
                                            <PopUpWrapper>
                                                {source
                                                    ? sourceSearchResult.map((item) => (
                                                          <div
                                                              key={item.id}
                                                              className={cx({ select_input_item: true })}
                                                              onMouseDown={(e) => e.preventDefault()}
                                                              onClick={() => {
                                                                  inputSourceRef.current.value = item.ten_nguon;
                                                                  setSource(item.ten_nguon);
                                                                  inputSourceRef.current.blur();
                                                              }}
                                                          >
                                                              <h4 className={cx({ title: true })}>{item.ten_nguon}</h4>
                                                          </div>
                                                      ))
                                                    : sourceList.map((item) => (
                                                          <div
                                                              key={item.id}
                                                              className={cx({ select_input_item: true })}
                                                              onMouseDown={(e) => e.preventDefault()}
                                                              onClick={() => {
                                                                  console.log(inputSourceRef.current.value);
                                                                  inputSourceRef.current.value = item.ten_nguon;
                                                                  setSource(item.ten_nguon);
                                                                  inputSourceRef.current.blur();
                                                              }}
                                                          >
                                                              <h4 className={cx({ title: true })}>{item.ten_nguon}</h4>
                                                          </div>
                                                      ))}
                                            </PopUpWrapper>
                                        </div>
                                    )}
                                >
                                    <input
                                        ref={inputSourceRef}
                                        type="text"
                                        id="input_source"
                                        autoComplete="off"
                                        value={
                                            typeof source == 'undefined' && getSourceById(contentItemState.nguon)
                                                ? getSourceById(contentItemState.nguon).ten_nguon
                                                : !source
                                                ? ''
                                                : source
                                        }
                                        onChange={(e) => {
                                            if (!e.target.value.startsWith(' ')) {
                                                setSource(e.target.value === '' ? null : e.target.value);
                                            }
                                        }}
                                        onFocus={() => {
                                            setShowSource(true);
                                        }}
                                        onBlur={(e) => {
                                            setShowSource(false);
                                            const source = sourceList.find((item) => item.ten_nguon === e.target.value);
                                            if (source) {
                                                setContentItemState({
                                                    ...contentItemState,
                                                    nguon: source.id,
                                                });
                                            } else {
                                                setSource('');
                                                setContentItemState({
                                                    ...contentItemState,
                                                    nguon: null,
                                                });
                                            }
                                        }}
                                    />
                                </HeadlessTippy>
                            </div>
                        </div>

                        <div className={cx({ two_col: true })}>
                            {/* type opportunity */}
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_typeOppotunity">Loại cơ hội</label>
                                <input
                                    type="text"
                                    id="input_typeOppotunity"
                                    autoComplete="off"
                                    value={contentItemState.loai_co_hoi ? contentItemState.loai_co_hoi : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                loai_co_hoi: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            {/* state */}
                            <div className={cx({ input_item_container: true })}>
                                <label>Trạng thái</label>
                                <select
                                    id="input_state"
                                    value={contentItemState.trang_thai ? contentItemState.trang_thai : 'Đang mở'}
                                    onChange={(e) => {
                                        setContentItemState({
                                            ...contentItemState,
                                            trang_thai: e.target.value,
                                        });
                                    }}
                                >
                                    <option value="Đang mở">Đang mở</option>
                                    <option value="Báo giá">Báo giá</option>
                                    <option value="Chuyển đổi">Chuyển đổi</option>
                                    <option value="Mất">Mất</option>
                                    <option value="Đã phản hồi">Đã phản hồi</option>
                                    <option value="Đã đóng">Đã đóng</option>
                                </select>
                            </div>

                            {/* perrson charge */}
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_personCharge">Người phụ trách</label>
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
                                                width: inputPersonChargeref.current.offsetWidth + 'px',
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
                                                                  inputPersonChargeref.current.value = item.email;
                                                                  setPersonCharge(item.email);
                                                                  inputPersonChargeref.current.blur();
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
                                                                  inputPersonChargeref.current.value = item.email;
                                                                  setPersonCharge(item.email);
                                                                  inputPersonChargeref.current.blur();
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
                                        ref={inputPersonChargeref}
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

                            {/* sales  phase */}
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_salePhase">Giai đoạn bán hàng</label>
                                <input
                                    type="text"
                                    id="input_salePhase"
                                    autoComplete="off"
                                    value={
                                        contentItemState.giai_doan_ban_hang ? contentItemState.giai_doan_ban_hang : ''
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                giai_doan_ban_hang: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_expectedEndDate">Ngày kết thúc dự kiến</label>
                                <input
                                    type="date"
                                    id="input_expectedEndDate"
                                    autoComplete="off"
                                    value={
                                        contentItemState.ngay_ket_thuc_du_kien
                                            ? contentItemState.ngay_ket_thuc_du_kien.substring(0, 10)
                                            : ''
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ngay_ket_thuc_du_kien: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* group2 */}
                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Theo sát</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                {/* next contact by */}
                                <label htmlFor="input_nextContactBy">Liên hệ tiếp theo bằng</label>
                                <HeadlessTippy
                                    interactive="true"
                                    visible={showNextContactBy}
                                    placement="bottom"
                                    render={(attrs) => (
                                        <div
                                            ref={tippyRef}
                                            className={cx({ select_input: true })}
                                            tabIndex="-1"
                                            {...attrs}
                                            style={{
                                                width: inputPersonChargeref.current.offsetWidth + 'px',
                                            }}
                                        >
                                            <PopUpWrapper>
                                                {nextContactBy
                                                    ? nextContactBySearchResult.map((item) => (
                                                          <div
                                                              key={item.id}
                                                              className={cx({ select_input_item: true })}
                                                              onMouseDown={(e) => e.preventDefault()}
                                                              onClick={() => {
                                                                  inputNextContactByRef.current.value = item.email;
                                                                  setNextContactBy(item.email);
                                                                  inputNextContactByRef.current.blur();
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
                                                                  inputNextContactByRef.current.value = item.email;
                                                                  setNextContactBy(item.email);
                                                                  inputNextContactByRef.current.blur();
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
                                        ref={inputNextContactByRef}
                                        type="text"
                                        id="input_personCharge"
                                        autoComplete="off"
                                        value={
                                            typeof nextContactBy == 'undefined' &&
                                            getStaffByCode(contentItemState.lien_he_tiep_theo_bang)
                                                ? getStaffByCode(contentItemState.lien_he_tiep_theo_bang).email
                                                : !nextContactBy
                                                ? ''
                                                : nextContactBy
                                        }
                                        onChange={(e) => {
                                            if (!e.target.value.startsWith(' ')) {
                                                setNextContactBy(e.target.value === '' ? null : e.target.value);
                                            }
                                        }}
                                        onFocus={() => {
                                            setShowNextContactBy(true);
                                        }}
                                        onBlur={(e) => {
                                            setShowNextContactBy(false);
                                            console.log(e.target.value);
                                            const staff = staffList.find((item) => item.email === e.target.value);
                                            if (staff) {
                                                setContentItemState({
                                                    ...contentItemState,
                                                    lien_he_tiep_theo_bang: staff.ma_nv,
                                                });
                                            } else {
                                                setPersonCharge('');
                                                setContentItemState({
                                                    ...contentItemState,
                                                    lien_he_tiep_theo_bang: null,
                                                });
                                            }
                                        }}
                                    />
                                </HeadlessTippy>
                            </div>

                            {/* next contact data */}
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_nextContactDate">Ngày liên hệ tiếp theo</label>
                                <input
                                    type="date"
                                    id="input_nextContactDate"
                                    autoComplete="off"
                                    value={
                                        contentItemState.ngay_lien_he_tiep_theo
                                            ? contentItemState.ngay_lien_he_tiep_theo.substring(0, 10)
                                            : ''
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ngay_lien_he_tiep_theo: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>

                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="">Vấn đề thảo luận</label>
                                <textarea
                                    className={cx({ m_height_200: true })}
                                    value={contentItemState.thao_luan ? contentItemState.thao_luan : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                thao_luan: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* group3 */}
                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Bán hàng</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_Currency_Unit">Đơn vị tiền tệ</label>
                                <input
                                    ref={inputCurrencyUnitRef}
                                    type="text"
                                    id="input_Currency_Unit"
                                    autoComplete="off"
                                    value={
                                        contentItemState.don_vi_tien_te ? contentItemState.don_vi_tien_te : currencyUnit
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                don_vi_tien_te: e.target.value === '' ? null : e.target.value,
                                            });
                                        setCurrencyUnit(e.target.value);
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_opportunityMoney">Số tiền cơ hội</label>
                                <input
                                    ref={inputOpportunityMoneyRef}
                                    type="text"
                                    id="input_opportunityMoney"
                                    autoComplete="off"
                                    value={
                                        contentItemState.so_tien_co_hoi
                                            ? contentItemState.so_tien_co_hoi
                                            : opportunityMoney
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                so_tien_co_hoi: e.target.value === '' ? null : e.target.value,
                                            });
                                        setOpportunityMoney(e.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_probability">Xác suất (%)</label>
                                <input
                                    ref={inputProbabillityRef}
                                    type="text"
                                    id="input_probability"
                                    autoComplete="off"
                                    value={contentItemState.xac_suat ? contentItemState.xac_suat : probability}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                xac_suat: e.target.value === '' ? null : e.target.value,
                                            });
                                        setProbability(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* group4 */}
                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Thông tin liên hệ</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_address">Địa chỉ liên hệ</label>
                                <input
                                    ref={inputAddressRef}
                                    type="text"
                                    id="input_address"
                                    autoComplete="off"
                                    value={
                                        inputOppotunityFromRef.current && typeof address == 'undefined'
                                            ? inputOppotunityFromRef.current.value === 'Danh sách khách hàng'
                                                ? getCustomerByCode(inputPartnerRef.current.value)
                                                    ? getCustomerByCode(inputPartnerRef.current.value).dia_chi
                                                    : ''
                                                : getPotentialCustomerByCode(inputPartnerRef.current.value)
                                                ? getPotentialCustomerByCode(inputPartnerRef.current.value).dia_chi_1
                                                : ''
                                            : address
                                            ? address
                                            : ''
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                dia_chi_khach_hang: e.target.value === '' ? null : e.target.value,
                                            });
                                        setAddress(e.target.value);
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_nation">Quóc gia</label>
                                <input
                                    ref={inputNationRef}
                                    type="text"
                                    id="input_nation"
                                    autoComplete="off"
                                    value={
                                        inputOppotunityFromRef.current && typeof nation == 'undefined'
                                            ? inputOppotunityFromRef.current.value === 'Danh sách khách hàng'
                                                ? getCustomerByCode(inputPartnerRef.current.value) &&
                                                  getCustomerByCode(inputPartnerRef.current.value).quoc_gia
                                                : getPotentialCustomerByCode(inputPartnerRef.current.value) &&
                                                  getPotentialCustomerByCode(inputPartnerRef.current.value).quoc_gia
                                            : typeof nation == 'undefined'
                                            ? 'Việt Nam'
                                            : nation
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
                        </div>

                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_customerGroup">Nhóm khách hàng</label>
                                <input
                                    ref={inputCustomerGroupRef}
                                    type="text"
                                    id="input_customerGroup"
                                    readOnly={
                                        inputOppotunityFromRef.current
                                            ? inputOppotunityFromRef.current.value === 'Danh sách khách hàng'
                                                ? false
                                                : true
                                            : true
                                    }
                                    autoComplete="off"
                                    value={
                                        inputOppotunityFromRef.current && typeof customerGroup == 'undefined'
                                            ? inputOppotunityFromRef.current.value === 'Danh sách khách hàng'
                                                ? getCustomerByCode(inputPartnerRef.current.value)
                                                    ? getCustomerByCode(inputPartnerRef.current.value).nhom_khach_hang
                                                    : ''
                                                : ''
                                            : customerGroup
                                            ? customerGroup
                                            : ''
                                    }
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                nhom_khach_hang: e.target.value === '' ? null : e.target.value,
                                            });

                                        setCustomerGroup(e.target.value);
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

export default OpportunityDetail;
