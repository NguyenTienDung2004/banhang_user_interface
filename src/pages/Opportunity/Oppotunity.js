import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './opportunity.module.scss';
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

function Oppotunity() {
    const contextDataConsumer = useContext(contextData);
    const [idContentItemDeleted, setIdContentItemDeleted] = useState(() => {
        return contextDataConsumer.context.idContentItemDeleted || [];
    });
    let [contentItemList, setContentItemList] = useState([]);
    const [customerList, setCustomerList] = useState([]);

    //state search
    const [searchName, setSearchName] = useState('');
    const [searchOpportunityFrom, setSearchOpportunityFrom] = useState('');
    const [searchOpportunityCode, setSearchOpportunityCode] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const checkAllRef = useRef();
    const btnSortRef = useRef();

    if (checkAllRef.current) {
        idContentItemDeleted.length === contentItemList.length && contentItemList.length > 0
            ? (checkAllRef.current.checked = true)
            : (checkAllRef.current.checked = false);
    }

    //get oppor from API
    useEffect(() => {
        const getContentItemList = async () => {
            const response = await getService.getOpportunity();

            const data = response.sort((a, b) => {
                const lastNameA = a.ten_khach_hang_tiem_nang ? a.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0] : '';
                const lastNameB = b.ten_khach_hang_tiem_nang ? b.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0] : '';
                return lastNameA.localeCompare(lastNameB);
            });

            setContentItemList(data);
        };
        getContentItemList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idContentItemDeleted]);

    //get opportunity by id
    function getOpportunityById(id) {
        const result = contentItemList.find((item) => item.id === id);
        return result;
    }

    //get customerlist from api
    async function getCustomerListFromApi() {
        const response = await getService.getCustomerList();
        setCustomerList(response);
    }
    //get customer by opportunity code
    function getCustomerByOpportunityCode(opportunityCode) {
        const result = customerList.find((item) => item.loai_co_hoi === opportunityCode);
        return result;
    }


    useEffect(() => {
        getCustomerListFromApi();
    }, []);

    //set setContext while idContentItemDeleted is changed
    useEffect(() => {
        contextDataConsumer.setContext({
            ...contextDataConsumer.context,
            idContentItemDeleted: idContentItemDeleted,
        });
        idContentItemDeleted.length === contentItemList.length
            ? (checkAllRef.current.checked = true)
            : (checkAllRef.current.checked = false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idContentItemDeleted]);

    //handle search
    useEffect(() => {
        const result = contentItemList.filter((item) => {
            const matchName = searchName
                ? item.ten_khach_hang_tiem_nang.toLowerCase().includes(searchName.toLowerCase())
                : true;
            const matchOpportunityFrom = searchOpportunityFrom
                ? item.co_hoi_den_tu.toLowerCase().includes(searchOpportunityFrom.toLowerCase())
                : true;
            const matchOpportunityCode = searchOpportunityCode
                ? item.ma_so.toLowerCase().includes(searchOpportunityCode.toLowerCase())
                : true;
            const matchStatus = searchStatus
                ? item.trang_thai.toLowerCase().includes(searchStatus.toLowerCase())
                : true;

            return matchName && matchOpportunityFrom && matchOpportunityCode && matchStatus;
        });
        setSearchResult(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchName, searchOpportunityFrom, searchOpportunityCode, searchStatus]);

    //handle delete
    async function handleDelete() {
        try {
            const deleteRequests = idContentItemDeleted.map((id) => {
                const oppo = getOpportunityById(id);
                const cus = getCustomerByOpportunityCode(oppo.ma_so);
                return !cus
                    ? deleteService.deleteOpportunity(id)
                    : alert(`Không thể xóa ${oppo.ma_so} vì đang liên kết với ${cus.ma_so}`);
            });
            const responses = await Promise.all(deleteRequests);
            console.log('Deleted:', responses);
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
            const response = await getService.getOpportunity();
            const data = response.sort((a, b) => {
                const lastNameA = a.ten_khach_hang_tiem_nang ? a.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0] : '';
                const lastNameB = b.ten_khach_hang_tiem_nang ? b.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0] : '';
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
            const response = await updateService.updateOpportunity(contentItem.id, updatedContentItem);
            console.log('Success:', response);
            setContentItemList((prevContentItemList) =>
                prevContentItemList.map((item) => (item.id === contentItem.id ? updatedContentItem : item)),
            );
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
                    const lastNameA = a.ten_khach_hang_tiem_nang
                        ? a.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0]
                        : '';
                    const lastNameB = b.ten_khach_hang_tiem_nang
                        ? b.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0]
                        : '';
                    return lastNameA.localeCompare(lastNameB);
                });
                return sortedList;
            });
        } else {
            e.target.classList.add('decrease');
            setContentItemList((prevContentItemList) => {
                const sortedList = [...prevContentItemList].sort((a, b) => {
                    const lastNameA = a.ten_khach_hang_tiem_nang
                        ? a.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0]
                        : '';
                    const lastNameB = b.ten_khach_hang_tiem_nang
                        ? b.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0]
                        : '';
                    return lastNameB.localeCompare(lastNameA);
                });
                return sortedList;
            });
        }
    }

    if (btnSortRef.current && btnSortRef.current.classList.contains('decrease')) {
        contentItemList.sort((a, b) => {
            const lastNameA = a.ten_khach_hang_tiem_nang ? a.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ten_khach_hang_tiem_nang ? b.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0] : '';
            return lastNameB.localeCompare(lastNameA);
        });
    } else if (btnSortRef.current && !btnSortRef.current.classList.contains('decrease')) {
        contentItemList.sort((a, b) => {
            const lastNameA = a.ten_khach_hang_tiem_nang ? a.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ten_khach_hang_tiem_nang ? b.ten_khach_hang_tiem_nang.split(' ').slice(-1)[0] : '';
            return lastNameA.localeCompare(lastNameB);
        });
    }

    //return
    return (
        <div className={cx({ feature_wrapper: true })}>
            {/* head */}
            <div className={cx({ feature_page_head_wrapper: true })}>
                <h2 className={cx('title')}>Cơ hội</h2>
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
                            to={routesConfig.OpportunityDetail}
                            className={cx({
                                btn_add: true,
                            })}
                            onClick={() => {
                                contextDataConsumer.setContext({ ...contextDataConsumer.context, contentItem: {} });
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} className={cx({ btn_add_icon: true })} />
                            <span>Thêm cơ hội</span>
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
                            value={searchOpportunityFrom}
                            onChange={(e) => {
                                setSearchOpportunityFrom(e.target.value);
                            }}
                        >
                            <option value="">Cơ hội từ</option>
                            <option value="Danh sách khách hàng">Danh sách khách hàng</option>
                            <option value="Khách hàng tiềm năng">Khách hàng tiềm năng</option>
                        </select>

                        <input
                            className={cx({ search_input: true })}
                            placeholder="Mã cơ hội"
                            value={searchOpportunityCode}
                            onChange={(e) => {
                                setSearchOpportunityCode(e.target.value);
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
                            <option value="Đang mở">Đang mở</option>
                            <option value="Báo giá">Báo giá</option>
                            <option value="Chuyển đổi">Chuyển đổi</option>
                            <option value="Mất">Mất</option>
                            <option value="Đã phản hồi">Đã phản hồi</option>
                            <option value="Đã đóng">Đã đóng</option>
                        </select>
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
                                Trạng thái
                            </span>
                            <span
                                className={cx({
                                    content_header_item: true,
                                    medium: true,
                                    t_left: true,
                                })}
                            >
                                Mã số
                            </span>
                            <span
                                className={cx({
                                    content_header_item: true,
                                    large: true,
                                    t_left: true,
                                })}
                            >
                                Cơ hội từ
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
                        {(searchName || searchStatus || searchOpportunityFrom || searchOpportunityCode
                            ? searchResult
                            : contentItemList
                        ).length === 0 ? (
                            <div className={cx('empty_content')}>
                                <img src={images.emptyImage} alt="empty" />
                                <p>Không tồn tại cơ hội</p>
                                <Link
                                    to={routesConfig.OpportunityDetail}
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
                                    <span>Thêm cơ hội</span>
                                </Link>
                            </div>
                        ) : (
                            (searchName || searchStatus || searchOpportunityFrom || searchOpportunityCode
                                ? searchResult
                                : contentItemList
                            ).map((contentItem) => {
                                return (
                                    <Link
                                        key={contentItem.id}
                                        className={cx({ content_item: true })}
                                        to={routesConfig.OpportunityDetail}
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
                                                {
                                                contentItem.ten_khach_hang_tiem_nang
                                                /* {contentItem.co_hoi_den_tu === 'Danh sách khách hàng'
                                                    ? (() => {
                                                          const customer = getCustomerByCustomerCode(
                                                              contentItem.doi_tac_dskh,
                                                          );
                                                          return customer ? customer.ho_ten : '';
                                                      })()
                                                    : (() => {
                                                          const potentialCustomer =
                                                              getPotentialCustomerByPotentialCustomerCode(
                                                                  contentItem.doi_tac_khtn,
                                                              );
                                                          return potentialCustomer ? potentialCustomer.ten : '';
                                                      })()} */}
                                            </span>
                                            <span
                                                className={cx({
                                                    content_item_field: true,
                                                    text_regular: true,
                                                    small: true,
                                                    t_left: true,
                                                })}
                                            >
                                                {contentItem.trang_thai}
                                            </span>
                                            <span
                                                className={cx({
                                                    content_item_field: true,
                                                    text_regular: true,
                                                    medium: true,
                                                    t_left: true,
                                                })}
                                            >
                                                {contentItem.ma_so}
                                            </span>
                                            <span
                                                className={cx({
                                                    content_item_field: true,
                                                    text_regular: true,
                                                    large: true,
                                                    t_left: true,
                                                })}
                                            >
                                                {contentItem.co_hoi_den_tu}
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

export default Oppotunity;
