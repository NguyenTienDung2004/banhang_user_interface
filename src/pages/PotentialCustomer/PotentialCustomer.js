import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './potentialCustomer.module.scss';
import classNames from 'classnames/bind';
import { contextData } from '~/component/ContextData/ContextData';
import { useContext, useRef } from 'react';
import {
    faArrowDownWideShort,
    faArrowRotateRight,
    faArrowUpWideShort,
    faHeart,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import images from '~/assets/images';
import routesConfig from '~/configs/routesConfigs';
import { useEffect, useState } from 'react';
import * as getService from '~/apiService/getService';
import * as deleteService from '~/apiService/deleteService';
import * as updateService from '~/apiService/updateService';

const cx = classNames.bind(styles);

function PotentialCustomer() {
    const contextDataConsumer = useContext(contextData);
    const [idContentItemDeleted, setIdContentItemDeleted] = useState(() => {
        return contextDataConsumer.context.idContentItemDeleted || [];
    });
    let [contentItemList, setContentItemList] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [opportunityList, setOpportunityList] = useState([]);
    const [customerList, setCustomerList] = useState([]);

    //state search
    const [searchName, setSearchName] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [searchPotentialCustomerCode, setSearchPotentialCustomerCode] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const checkAllRef = useRef();
    const btnSortRef = useRef();

    if (checkAllRef.current) {
        idContentItemDeleted.length === contentItemList.length && contentItemList.length > 0
            ? (checkAllRef.current.checked = true)
            : (checkAllRef.current.checked = false);
    }

    //get potential customer from API
    const getContentItemList = async () => {
        const response = await getService.getPotentialCustomerList();

        const data = response.sort((a, b) => {
            const lastNameA = a.ten ? a.ten.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ten ? b.ten.split(' ').slice(-1)[0] : '';
            return lastNameA.localeCompare(lastNameB);
        });

        setContentItemList(data);
    };

    //get potential customer by id
    function getPotentialCustomerById(id) {
        const result = contentItemList.find((item) => item.id === id);
        return result;
    }

    //get opportunity list from api
    async function getOpportunityList() {
        const response = await getService.getOpportunity();
        setOpportunityList(response);
    }
    //get opportunity list by potential customer code
    function getOpportunityByPCusCode(pCusCode) {
        const result = opportunityList.find((item) => item.doi_tac === pCusCode);
        return result;
    }
    //get customer list from api
    async function getCustomerListFromApi() {
        const response = await getService.getCustomerList();
        setCustomerList(response);
    }
    //get customer by potential customer code
    function getCustomerByPCusCode(pCusCode) {
        const result = customerList.find((item) => item.khach_hang_tiem_nang === pCusCode);
        return result;
    }

    useEffect(() => {
        getOpportunityList();
        getStaffList();
        getCustomerListFromApi();
    }, []);

    //get staff list from API
    async function getStaffList() {
        const response = await getService.getStaff();
        setStaffList(response);
    }

    //get staff by code
    function getStaffByCode(staffCode) {
        const result = staffList.find((staff) => staff.ma_nv === staffCode);
        return result;
    }

    //set setContext while idContentItemDeleted is changed
    useEffect(() => {
        contextDataConsumer.setContext({
            ...contextDataConsumer.context,
            idContentItemDeleted: idContentItemDeleted,
        });
        idContentItemDeleted.length === contentItemList.length
            ? (checkAllRef.current.checked = true)
            : (checkAllRef.current.checked = false);

        getContentItemList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idContentItemDeleted]);

    //handle search
    useEffect(() => {
        const result = contentItemList.filter((item) => {
            const matchName = searchName ? item.ten.toLowerCase().includes(searchName.toLowerCase()) : true;
            const matchStatus = searchStatus
                ? item.trang_thai.toLowerCase().includes(searchStatus.toLowerCase())
                : true;
            const matchPotentialCustomerCode = searchPotentialCustomerCode
                ? item.ma_so.toLowerCase().includes(searchPotentialCustomerCode.toLowerCase())
                : true;

            return matchName && matchStatus && matchPotentialCustomerCode;
        });
        setSearchResult(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchName, searchStatus, searchPotentialCustomerCode]);

    //handle delete
    async function handleDelete() {
        try {
            const deleteRequests = idContentItemDeleted.map(async (id) => {
                const pcus = getPotentialCustomerById(id);
                const oppor = getOpportunityByPCusCode(pcus.ma_so);
                const cus = getCustomerByPCusCode(pcus.ma_so);

                if (oppor && cus) {
                    alert(
                        `Không thể xóa khách hàng tiềm năng - ${pcus.ma_so} vì liên kết với cơ hội - ${oppor.ma_so} và khách hàng - ${cus.ma_so}`,
                    );
                    return Promise.resolve(null); // Trả về promise để giữ cho cấu trúc đồng bộ
                } else if (oppor) {
                    alert(`Không thể xóa khách hàng tiềm năng - ${pcus.ma_so} vì liên kết với cơ hội - ${oppor.ma_so}`);
                    return Promise.resolve(null);
                } else if (cus) {
                    alert(
                        `Không thể xóa khách hàng tiềm năng - ${pcus.ma_so} vì liên kết với khách hàng - ${cus.ma_so}`,
                    );
                    return Promise.resolve(null);
                } else {
                    return deleteService.deletePotentialCustomer(id); // Trả về promise xóa
                }
            });

            const responses = await Promise.all(deleteRequests);
            console.log(
                'Deleted:',
                responses.filter((response) => response !== null),
            );
            setIdContentItemDeleted([]);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    //handle checkbox content item
    function handleCheckBoxContentItem(e, contentItem) {
        e.stopPropagation();
        if (e.target.checked) {
            setIdContentItemDeleted([...idContentItemDeleted, contentItem.id]);
        } else {
            const newIdContentItemDeleted = idContentItemDeleted.filter((item) => item !== contentItem.id);
            setIdContentItemDeleted([...newIdContentItemDeleted]);
        }
    }

    // handle check all content item
    function handleCheckAll(e) {
        if (e.target.checked) {
            const contentIdArr = contentItemList.map((item) => item.id);
            setIdContentItemDeleted([...contentIdArr]);
        } else {
            setIdContentItemDeleted([]);
        }
    }

    //handle rerender
    function handleRerender() {
        btnSortRef.current.classList.contains('decrease') && btnSortRef.current.classList.remove('decrease');
        const getContentItemList = async () => {
            const response = await getService.getPotentialCustomerList();
            const data = response.sort((a, b) => {
                const lastNameA = a.ten ? a.ten.split(' ').slice(-1)[0] : '';
                const lastNameB = b.ten ? b.ten.split(' ').slice(-1)[0] : '';
                return lastNameA.localeCompare(lastNameB);
            });
            setContentItemList(data);
        };
        getContentItemList();
    }

    // handle marked heart
    async function handleMarkedHeart(e, contentItem) {
        e.preventDefault();
        const updatedContentItem = { ...contentItem, tim: contentItem.tim === 1 ? -1 : 1 };

        try {
            setContentItemList((prevContentItemList) =>
                prevContentItemList.map((item) => (item.id === contentItem.id ? updatedContentItem : item)),
            );
            const response = await updateService.updatePotentialCustomer(contentItem.id, updatedContentItem);
            console.log('Success:', response);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    //handle sort
    function handleSort(e) {
        if (e.target.classList.contains('decrease')) {
            e.target.classList.remove('decrease');
            setContentItemList((prevContentItemList) => {
                const sortedList = [...prevContentItemList].sort((a, b) => {
                    const lastNameA = a.ten ? a.ten.split(' ').slice(-1)[0] : '';
                    const lastNameB = b.ten ? b.ten.split(' ').slice(-1)[0] : '';
                    return lastNameA.localeCompare(lastNameB);
                });
                return sortedList;
            });
        } else {
            e.target.classList.add('decrease');
            setContentItemList((prevContentItemList) => {
                const sortedList = [...prevContentItemList].sort((a, b) => {
                    const lastNameA = a.ten ? a.ten.split(' ').slice(-1)[0] : '';
                    const lastNameB = b.ten ? b.ten.split(' ').slice(-1)[0] : '';
                    return lastNameB.localeCompare(lastNameA);
                });
                return sortedList;
            });
        }
    }

    if (btnSortRef.current && btnSortRef.current.classList.contains('decrease')) {
        contentItemList.sort((a, b) => {
            const lastNameA = a.ten ? a.ten.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ten ? b.ten.split(' ').slice(-1)[0] : '';
            return lastNameB.localeCompare(lastNameA);
        });
    } else if (btnSortRef.current && !btnSortRef.current.classList.contains('decrease')) {
        contentItemList.sort((a, b) => {
            const lastNameA = a.ten ? a.ten.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ten ? b.ten.split(' ').slice(-1)[0] : '';
            return lastNameA.localeCompare(lastNameB);
        });
    }

    //return
    return (
        <div className={cx({ feature_wrapper: true })}>
            {/* head */}
            <div className={cx({ feature_page_head_wrapper: true })}>
                <h2 className={cx('title')}>Khách hàng tiềm năng</h2>
                <div className={cx({ feature_action_container: true })}>
                    <button
                        className={cx({
                            btn_re_render: true,
                        })}
                        onClick={handleRerender}
                    >
                        <FontAwesomeIcon icon={faArrowRotateRight} />
                    </button>

                    {/* btn add/remove */}
                    {idContentItemDeleted.length > 0 ? (
                        <button className={cx('btn_remove')} onClick={handleDelete}>
                            Xóa
                        </button>
                    ) : (
                        <Link
                            to={routesConfig.PotentialCustomerDetail}
                            className={cx({
                                btn_add: true,
                            })}
                            onClick={() => {
                                contextDataConsumer.setContext({ ...contextDataConsumer.context, contentItem: {} });
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} className={cx({ btn_add_icon: true })} />
                            <span>Thêm khách hàng tiềm năng</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* content */}
            <div className={cx({ content_wrapper: true })}>
                {/* content header  */}
                <div className={cx({ content_header: true })}>
                    {/* search */}
                    <div className={cx('search_content')}>
                        <input
                            className={cx({ search_input: true })}
                            value={searchName}
                            placeholder="Tên"
                            onChange={(e) => {
                                setSearchName(e.target.value);
                            }}
                        />

                        <select
                            className={cx({ search_input: true })}
                            value={searchStatus}
                            onChange={(e) => {
                                setSearchStatus(e.target.value);
                            }}
                        >
                            <option value="">Trạng thái</option>
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
                        <input
                            className={cx({ search_input: true })}
                            placeholder="Mã khách hàng tiềm năng"
                            value={searchPotentialCustomerCode}
                            onChange={(e) => {
                                setSearchPotentialCustomerCode(e.target.value);
                            }}
                        />
                    </div>
                    <button ref={btnSortRef} className={cx('sort_content')} onClick={handleSort}>
                        <FontAwesomeIcon
                            icon={faArrowUpWideShort}
                            className={cx({
                                increase_icon: true,
                            })}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.currentTarget.parentNode.click();
                            }}
                        />
                        <FontAwesomeIcon
                            icon={faArrowDownWideShort}
                            className={cx({
                                decrease_icon: true,
                            })}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.currentTarget.parentNode.click();
                            }}
                        />
                    </button>
                </div>

                {/* content body  */}
                <div className={cx({ list_content: true })}>
                    {/* content body header  */}
                    <div className={cx({ list_content_header_wrapper: true })}>
                        <input
                            ref={checkAllRef}
                            type="checkbox"
                            className={cx({ check_all_content: true })}
                            onClick={(e) => e.stopPropagation()}
                            onChange={handleCheckAll}
                        />
                        <div className={cx({ list_title_header: true })}>
                            <span
                                className={cx({
                                    content_header_item: true,
                                    medium: true,
                                    t_left: true,
                                })}
                            >
                                Họ tên
                            </span>
                            <span
                                className={cx({
                                    content_header_item: true,
                                    small: true,
                                    t_left: true,
                                })}
                            >
                                Tên tổ chức
                            </span>
                            <span
                                className={cx({
                                    content_header_item: true,
                                    medium: true,
                                    t_left: true,
                                })}
                            >
                                Người phụ trách
                            </span>
                            <span
                                className={cx({
                                    content_header_item: true,
                                    large: true,
                                    t_left: true,
                                })}
                            >
                                Mã khách hàng tiềm năng
                            </span>
                            <span
                                className={cx({
                                    content_header_item: true,
                                    small: true,
                                    t_right: true,
                                })}
                            >
                                Tổng: {contentItemList.length}
                            </span>
                        </div>
                    </div>

                    {/* content item */}
                    <div className={cx({ list_content_body: true })}>
                        {(searchName || searchStatus || searchPotentialCustomerCode ? searchResult : contentItemList)
                            .length === 0 ? (
                            <div className={cx('empty_content')}>
                                <img src={images.emptyImage} alt="empty" />
                                <p>Không tồn tại khách hàng tiềm năng</p>
                                <Link
                                    to={routesConfig.PotentialCustomerDetail}
                                    className={cx({
                                        btn_add: true,
                                    })}
                                    onClick={() => {
                                        contextDataConsumer.setContext({
                                            ...contextDataConsumer.context,
                                            contentItem: {},
                                        });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus} className={cx('btn_add_icon')} />
                                    <span>Thêm khách hàng tiềm năng</span>
                                </Link>
                            </div>
                        ) : (
                            (searchName || searchStatus || searchPotentialCustomerCode
                                ? searchResult
                                : contentItemList
                            ).map((contentItem) => {
                                return (
                                    <Link
                                        key={contentItem.id}
                                        className={cx({ content_item: true })}
                                        to={routesConfig.PotentialCustomerDetail}
                                        onClick={() => {
                                            contextDataConsumer.setContext({
                                                ...contextDataConsumer.context,
                                                contentItem,
                                            });
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            className={cx({ check_content_item: true })}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => handleCheckBoxContentItem(e, contentItem)}
                                            checked={idContentItemDeleted.includes(contentItem.id)}
                                        />
                                        <div className={cx('content_item_field_list')}>
                                            <span
                                                className={cx({
                                                    content_item_field: true,
                                                    text_bold: true,
                                                    medium: true,
                                                    t_left: true,
                                                })}
                                            >
                                                {contentItem.ten}
                                            </span>
                                            <span
                                                className={cx({
                                                    content_item_field: true,
                                                    text_regular: true,
                                                    small: true,
                                                    t_left: true,
                                                })}
                                            >
                                                {contentItem.ten_to_chuc}
                                            </span>
                                            <span
                                                className={cx({
                                                    content_item_field: true,
                                                    text_regular: true,
                                                    medium: true,
                                                    t_left: true,
                                                })}
                                            >
                                                {getStaffByCode(contentItem.nguoi_quan_li)
                                                    ? getStaffByCode(contentItem.nguoi_quan_li).email
                                                    : ''}
                                            </span>
                                            <span
                                                className={cx({
                                                    content_item_field: true,
                                                    text_regular: true,
                                                    large: true,
                                                    t_left: true,
                                                })}
                                            >
                                                {contentItem.ma_so}
                                            </span>
                                            <span
                                                className={cx({
                                                    content_item_field: true,
                                                    text_regular: true,
                                                    small: true,
                                                    t_right: true,
                                                })}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faHeart}
                                                    className={cx({
                                                        heartIcon: true,
                                                        heartIsChecked: contentItem.tim === -1 ? false : true,
                                                    })}
                                                    onClick={(e) => handleMarkedHeart(e, contentItem)}
                                                />
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PotentialCustomer;
