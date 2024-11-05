/* eslint-disable no-self-assign */
/* eslint-disable react-hooks/exhaustive-deps */
import styles from './potentialCustomerDetail.module.scss';
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
function PotentialCustomerDetail() {
    const contextDataConsumer = useContext(contextData);
    const contentItem = contextDataConsumer.context.contentItem;
    const [contentItemState, setContentItemState] = useState(contentItem);
    const [staffList, setStaffList] = useState([]);
    const [sourceList, setSourceList] = useState([]);
    const [potentialCustomerList, setPotentialCustomerList] = useState();
    const [nation, setNation] = useState('Việt Nam');
    const [customerList, setCustomerList] = useState([]);
    const [opportunityList, setOpportunityList] = useState([]);

    const isOrganizationRef = useRef();
    const inputPersonChargeref = useRef();
    const inputSourceRef = useRef();
    const tippyRef = useRef();
    const inputCodePotentialCustomerRef = useRef();
    const inputNextContactByRef = useRef();
    const inputNationRef = useRef();

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

    //get customer list from api
    async function getCustomerListFromApi() {
        const response = await getService.getCustomerList();
        setCustomerList(response);
    }
    // get customeer list by potential customer
    function getCustomerListByPotentialCustomerCode(potentialCustomerCode) {
        const result = customerList.filter((item) => item.khach_hang_tiem_nang === potentialCustomerCode);
        return result;
    }

    //get opportunity list from api
    async function getOpportunityListFromApi() {
        const response = await getService.getOpportunity();
        setOpportunityList(response);
    }
    //get opportunity list by potential customer code
    function getOpporListByPcusCode(pcusCode) {
        const result = opportunityList.filter((item) => item.doi_tac_khtn === pcusCode);
        return result;
    }
    // get opportunity by customer code
    function getOpportunityListByCusCode(cusCode) {
        const result = opportunityList.filter((item) => item.doi_tac_dskh === cusCode);
        return result;
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

    //get staff from codeStaff
    function getStaffByCode(codeStaff) {
        const result = staffList.find((item) => item.ma_nv === codeStaff);
        return result;
    }

    //get source by id
    function getSourceById(id) {
        const result = sourceList.find((item) => item.id === id);
        return result;
    }

    //get potential customer list from api
    async function getPotentialListCustomer() {
        const response = await getService.getPotentialCustomerList();
        setPotentialCustomerList(response);
    }

    useEffect(() => {
        setContentItemState({
            ...contentItemState,
            ma_so: inputCodePotentialCustomerRef.current.value,
        });
        getStaffList();
        getSourceList();
        getPotentialListCustomer();
        getCustomerListFromApi();
        getOpportunityListFromApi();
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

    // handle save
    async function handleSave() {
        try {
            let response;
            if (Object.keys(contentItem).length === 0) {
                !contentItemState.trang_thai
                    ? (contentItemState.trang_thai = 'Khách hàng tiềm năng')
                    : (contentItemState.trang_thai = contentItemState.trang_thai);

                !contentItemState.gioi_tinh
                    ? (contentItemState.gioi_tinh = 'Nam')
                    : (contentItemState.gioi_tinh = contentItemState.gioi_tinh);

                !contentItemState.loai_dia_chi
                    ? (contentItemState.loai_dia_chi = 'Thanh toán')
                    : (contentItemState.loai_dia_chi = contentItemState.loai_dia_chi);

                contentItemState.quoc_gia = inputNationRef.current.value;

                response = await createService.createNewPotentialCustomer(contentItemState);

                //nếu id không bị reset sau khi xóa toàn bộ dữ liệu thì ta sẽ dùng id để làm giá trị cho biến này
                contextDataConsumer.setContext({
                    ...contextDataConsumer.context,
                    maxId: contextDataConsumer.context.maxId
                        ? contextDataConsumer.context.maxId + 1
                        : potentialCustomerList?.[potentialCustomerList.length - 1]?.id + 1 || 1,
                });
            } else {
                response = await updateService.updatePotentialCustomer(contentItem.id, contentItemState);
                const cusList = getCustomerListByPotentialCustomerCode(contentItemState.ma_so);
                const updatecustomerList = cusList.map((item) => {
                    return updateService.updateCustomer(item.id, {
                        ...item,
                        quoc_gia: contentItemState.quoc_gia,
                        dia_chi: contentItemState.dia_chi_1,
                        std: contentItemState.std,
                        email: contentItemState.dia_chi_email,
                        ho_ten: contentItemState.ten,
                    });
                });
                await Promise.all(updatecustomerList);
                let opporList = cusList.reduce((accu, item) => {
                    accu = accu.concat(getOpportunityListByCusCode(item.ma_so));
                    return accu;
                }, []);
                opporList = opporList.concat(getOpporListByPcusCode(contentItemState.ma_so));

                const updateOpporList = opporList.map((item) => {
                    return updateService.updateOpportunity(item.id, {
                        ...item,
                        ten_khach_hang_tiem_nang: contentItemState.ten,
                        quoc_gia: contentItemState.quoc_gia,
                        dia_chi_khach_hang: contentItemState.dia_chi1,
                    });
                });
                await Promise.all(updateOpporList);
            }
            //set maxid  to contextDataConsumer

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
                        ? 'Thêm khách hàng tiềm năng'
                        : contentItem.khach_hang_la_mot_to_chuc
                        ? contentItem.ten_to_chuc
                        : contentItem.ten}
                </h2>
                <div className={cx({ feature_detailt_action_container: true })}>
                    <button
                        className={cx({
                            btn_save: true,
                        })}
                        onClick={() => {
                            if (
                                isOrganizationRef.current.checked &&
                                (contentItemState.ten_to_chuc === '' ||
                                    typeof contentItemState.ten_to_chuc === 'undefined' ||
                                    contentItemState.ten_to_chuc === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Tên tổ chức');
                            } else if (
                                !isOrganizationRef.current.checked &&
                                (contentItemState.ten === '' ||
                                    typeof contentItemState.ten === 'undefined' ||
                                    contentItemState.ten === null)
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
                        <div
                            className={cx({
                                input_item_container: true,
                                a_center: true,
                                d_flex: true,
                            })}
                        >
                            <input
                                ref={isOrganizationRef}
                                type="checkbox"
                                id="isOrganization"
                                disabled={Object.keys(contentItem).length > 0}
                                checked={contentItemState.khach_hang_la_mot_to_chuc || false}
                                onChange={(e) =>
                                    setContentItemState({
                                        ...contentItemState,
                                        khach_hang_la_mot_to_chuc: e.target.checked ? 1 : 0,
                                    })
                                }
                            />
                            <label htmlFor="isOrganization">Khách hàng tiềm năng là một tổ chức</label>
                        </div>
                    </div>
                </div>

                {/* group2 */}
                <div className={cx({ input_group: true })}>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_code_potential_customer">Mã khách hàng tiềm năng</label>
                                <input
                                    ref={inputCodePotentialCustomerRef}
                                    readOnly
                                    type="text"
                                    id="input_code_potential_customer"
                                    autoComplete="off"
                                    value={
                                        contentItemState.ma_so
                                            ? contentItemState.ma_so
                                            : `KH-PC-${contextDataConsumer.context.maxId || 1}`
                                    }
                                    onChange={() => {}}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_fullName">Họ và tên</label>
                                <input
                                    type="text"
                                    id="input_fullName"
                                    autoComplete="off"
                                    value={contentItemState.ten ? contentItemState.ten : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ten: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_organizationName">Tên tổ chức</label>
                                <input
                                    type="text"
                                    id="input_organizationName"
                                    autoComplete="off"
                                    value={contentItemState.ten_to_chuc ? contentItemState.ten_to_chuc : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ten_to_chuc: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_customerEmail">Địa chỉ Email</label>
                                <input
                                    type="text"
                                    id="input_customerEmail"
                                    autoComplete="off"
                                    value={contentItemState.dia_chi_email ? contentItemState.dia_chi_email : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                dia_chi_email: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>

                        {/* perrson charge */}
                        <div className={cx({ two_col: true })}>
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

                            <div className={cx({ input_item_container: true })}>
                                <label>Trạng thái</label>
                                <select
                                    id="input_state"
                                    value={
                                        contentItemState.trang_thai
                                            ? contentItemState.trang_thai
                                            : 'Khách hàng tiềm năng'
                                    }
                                    onChange={(e) => {
                                        setContentItemState({
                                            ...contentItemState,
                                            trang_thai: e.target.value,
                                        });
                                    }}
                                >
                                    <option value="Khách hàng tiềm năng">Khách hàng tiềm năng</option>
                                    <option value="Đang mở">Đang mở</option>
                                    <option value="Đã phản hồi">Đã phản hồi</option>
                                    <option value="Cơ hội">Cơ hội</option>
                                    <option value="Báo giá">Báo giá</option>
                                    <option value="Mất báo giá">Mất báo giá</option>
                                    <option value="Quan tâm">Quan tâm</option>
                                    <option value="Chuyển đổi">Chuyển đổi</option>
                                    <option value="Không liên hệ">Không liên hệ</option>
                                </select>
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_formAddress">Xưng hô</label>
                                <input
                                    type="text"
                                    id="input_formAddress"
                                    autoComplete="off"
                                    value={contentItemState.xung_ho ? contentItemState.xung_ho : ''}
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
                                    value={contentItemState.chuc_danh ? contentItemState.chuc_danh : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                chuc_danh: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            {/* GENDER */}
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
                            {/* CAMPAIGN */}
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_campaignName">Tên chiến dịch</label>

                                <input
                                    type="text"
                                    id="input_campaignName"
                                    autoComplete="off"
                                    value={contentItemState.ten_chien_dich ? contentItemState.ten_chien_dich : ''}
                                    onChange={(e) => {
                                        if (!e.target.value.startsWith(' ')) {
                                            setContentItemState({
                                                ...contentItemState,
                                                ten_chien_dich: e.target.value === '' ? null : e.target.value,
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* group3 */}
                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Theo sát</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
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
                                            getStaffByCode(contentItemState.lien_he_tiep_theo)
                                                ? getStaffByCode(contentItemState.lien_he_tiep_theo).email
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
                                            const staff = staffList.find((item) => {
                                                return item.email === e.target.value;
                                            });
                                            if (staff) {
                                                setContentItemState({
                                                    ...contentItemState,
                                                    lien_he_tiep_theo: staff.ma_nv,
                                                });
                                            } else {
                                                setNextContactBy('');
                                                setContentItemState({
                                                    ...contentItemState,
                                                    lien_he_tiep_theo: null,
                                                });
                                            }
                                        }}
                                    />
                                </HeadlessTippy>
                            </div>
                        </div>

                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_nextContactDate">Ngày liên hệ tiếp theo</label>
                                <input
                                    type="date"
                                    id="input_nextContactDate"
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

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_endsOn">Kết thúc vào</label>
                                <input
                                    type="date"
                                    id="input_endsOn"
                                    value={contentItemState.ket_thuc ? contentItemState.ket_thuc.substring(0, 10) : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ket_thuc: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* group4 */}
                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Ghi chú</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ input_item_container: true })}>
                            <label htmlFor="">Ghi chú</label>
                            <textarea
                                value={contentItemState.ghi_chu ? contentItemState.ghi_chu : ''}
                                onChange={(e) => {
                                    !e.target.value.startsWith(' ') &&
                                        setContentItemState({
                                            ...contentItemState,
                                            ghi_chu: e.target.value === '' ? null : e.target.value,
                                        });
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* group5 */}
                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Địa chỉ & Liên hệ</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="">Loại địa chỉ</label>
                                <select
                                    value={contentItemState.loai_dia_chi ? contentItemState.loai_dia_chi : 'Thanh toán'}
                                    onChange={(e) => {
                                        setContentItemState({
                                            ...contentItemState,
                                            loai_dia_chi: e.target.value,
                                        });
                                    }}
                                >
                                    <option value="Thanh toán">Thanh toán</option>
                                    <option value="Vận chuyển">Vận chuyển</option>
                                    <option value="Văn phòng">Văn phòng</option>
                                    <option value="Cá nhân">Cá nhân</option>
                                    <option value="Nhà máy">Nhà máy</option>
                                    <option value="Bưu chính">Bưu chính</option>
                                    <option value="Cửa hàng">Cửa hàng</option>
                                    <option value="Công ty con">Công ty con</option>
                                    <option value="Kho hàng">Kho hàng</option>
                                    <option value="Hiện tại">Hiện tại</option>
                                    <option value="Dài hạn">Dài hạn</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_addressName">Tên địa chỉ</label>
                                <input
                                    type="text"
                                    id="input_addressName"
                                    autoComplete="off"
                                    value={contentItemState.ten_dia_chi ? contentItemState.ten_dia_chi : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ten_dia_chi: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_address1">Địa chỉ 1</label>
                                <input
                                    type="text"
                                    id="input_address1"
                                    autoComplete="off"
                                    value={contentItemState.dia_chi_1 ? contentItemState.dia_chi_1 : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                dia_chi_1: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_address2">Địa chỉ 2</label>
                                <input
                                    type="text"
                                    id="input_address2"
                                    autoComplete="off"
                                    value={contentItemState.dia_chi_2 ? contentItemState.dia_chi_2 : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                dia_chi_2: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_city">Thành phố/Thị xã</label>
                                <input
                                    type="text"
                                    id="input_city"
                                    autoComplete="off"
                                    value={contentItemState.thanh_pho ? contentItemState.thanh_pho : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                thanh_pho: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_district">Quận/Huyện</label>
                                <input
                                    type="text"
                                    id="input_district"
                                    autoComplete="off"
                                    value={contentItemState.quan_huyen ? contentItemState.quan_huyen : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                quan_huyen: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>

                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_nation">Quốc gia</label>
                                <input
                                    ref={inputNationRef}
                                    type="text"
                                    id="input_nation"
                                    autoComplete="off"
                                    value={contentItemState.quoc_gia ? contentItemState.quoc_gia : nation}
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
                                <label htmlFor="input_postalCode">Mã bưu chính</label>
                                <input
                                    type="text"
                                    id="input_postalCode"
                                    autoComplete="off"
                                    value={contentItemState.ma_buu_chinh ? contentItemState.ma_buu_chinh : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                ma_buu_chinh: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* group6 */}
                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Liên lạc</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_transferFiles">Chuyển tệp</label>
                                <input
                                    type="text"
                                    id="input_transferFiles"
                                    autoComplete="off"
                                    value={contentItemState.chuyen_tep ? contentItemState.chuyen_tep : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                chuyen_tep: e.target.value === '' ? null : e.target.value,
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

                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_fax">Fax</label>
                                <input
                                    type="text"
                                    id="input_fax"
                                    autoComplete="off"
                                    value={contentItemState.fax ? contentItemState.fax : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                fax: e.target.value === '' ? null : e.target.value,
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

export default PotentialCustomerDetail;
