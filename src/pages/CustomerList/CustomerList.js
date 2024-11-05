import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './customerList.module.scss';
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

function CustomerList() {
    const contextDataConsumer = useContext(contextData);
    const [idContentItemDeleted, setIdContentItemDeleted] = useState(() => {
        return contextDataConsumer.context.idContentItemDeleted || [];
    });
    let [contentItemList, setContentItemList] = useState([]);
    const [contractList, setContractList] = useState([]);
    const [opportunityList, setOpportunityList] = useState([]);

    //state search
    const [searchName, setSearchName] = useState('');
    const [searchGroupCustomer, setSearchGroupCustomer] = useState('');
    const [searchNation, setSearchNation] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const checkAllRef = useRef();
    const btnSortRef = useRef();

    if (checkAllRef.current) {
        idContentItemDeleted.length === contentItemList.length && contentItemList.length > 0
            ? (checkAllRef.current.checked = true)
            : (checkAllRef.current.checked = false);
    }

    //get customer from API
    const getContentItemList = async () => {
        const response = await getService.getCustomerList();

        const data = response.sort((a, b) => {
            const lastNameA = a.ho_ten ? a.ho_ten.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ho_ten ? b.ho_ten.split(' ').slice(-1)[0] : '';
            return lastNameA.localeCompare(lastNameB);
        });
        setContentItemList(data);
    };

    useEffect(() => {
        getContentItemList();
    }, [idContentItemDeleted]);

    //get customer by customer code
    function getCustomerByCustomerid(id) {
        const result = contentItemList.find((item) => item.id === id);
        return result;
    }

    //get contract list from api
    async function getContractList() {
        const response = await getService.getContract();
        setContractList(response);
    }
    // get contract by customer code
    function getContractByCustomerCode(customerCode) {
        const result = contractList.find((item) => item.ten_doi_tac === customerCode);
        return result;
    }

    //get opportunity fron api
    async function getOpportunityList() {
        const response = await getService.getOpportunity();
        setOpportunityList(response);
    }
    // get opportunity by customer code
    function getOpportunityByCustomerCode(customerCode) {
        const result = opportunityList.find((item) => item.doi_tac === customerCode);
        return result;
    }

    useEffect(() => {
        getContractList();
        getOpportunityList();
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
                ? (item.ho_ten ? item.ho_ten : '').toLowerCase().includes(searchName.toLowerCase())
                : true;
            const matchGroupCustomer = searchGroupCustomer
                ? item.nhom_khach_hang
                    ? item.nhom_khach_hang
                    : ''.toLowerCase().includes(searchGroupCustomer.toLowerCase())
                : true;
            const matchNation = searchNation
                ? (item.quoc_gia ? item.quoc_gia : '').toLowerCase().includes(searchNation.toLowerCase())
                : true;

            return matchName && matchGroupCustomer && matchNation;
        });
        setSearchResult(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchName, searchGroupCustomer, searchNation]);

    //handle delete
    async function handleDelete() {
        try {
            const deleteRequests = idContentItemDeleted.map((id) => {
                const cus = getCustomerByCustomerid(id);
                const contr = getContractByCustomerCode(cus.ma_so);
                const oppor = getOpportunityByCustomerCode(cus.ma_so);
                if (contr && oppor) {
                    alert(
                        `Không thể xóa khách hàng - ${cus.ma_so} vì liên kết với hợp đồng ${contr.ten_doi_tac} và cơ hội - ${oppor.ma_so}`,
                    );
                } else if (contr) {
                    alert(`Không thể xóa khách hàng - ${cus.ma_so} vì liên kết với hợp đồng ${contr.ten_doi_tac}`);
                } else if (oppor) {
                    alert(`Không thể xóa khách hàng - ${cus.ma_so} vì liên kết với cơ hội - ${oppor.ma_so}`);
                } else {
                    return deleteService.deleteCustomer(id);
                }
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
            const response = await getService.getCustomerList();
            const data = response.sort((a, b) => {
                const lastNameA = a.ho_ten ? a.ho_ten.split(' ').slice(-1)[0] : '';
                const lastNameB = b.ho_ten ? b.ho_ten.split(' ').slice(-1)[0] : '';
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
            const response = await updateService.updateCustomer(contentItem.id, updatedContentItem);
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
                    const lastNameA = a.ho_ten ? a.ho_ten.split(' ').slice(-1)[0] : '';
                    const lastNameB = b.ho_ten ? b.ho_ten.split(' ').slice(-1)[0] : '';
                    return lastNameA.localeCompare(lastNameB);
                });
                return sortedList;
            });
        } else {
            e.target.classList.add('decrease');
            setContentItemList((prevContentItemList) => {
                const sortedList = [...prevContentItemList].sort((a, b) => {
                    const lastNameA = a.ho_ten ? a.ho_ten.split(' ').slice(-1)[0] : '';
                    const lastNameB = b.ho_ten ? b.ho_ten.split(' ').slice(-1)[0] : '';
                    return lastNameB.localeCompare(lastNameA);
                });
                return sortedList;
            });
        }
    }

    if (btnSortRef.current && btnSortRef.current.classList.contains('decrease')) {
        contentItemList.sort((a, b) => {
            const lastNameA = a.ho_ten ? a.ho_ten.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ho_ten ? b.ho_ten.split(' ').slice(-1)[0] : '';
            return lastNameB.localeCompare(lastNameA);
        });
    } else if (btnSortRef.current && !btnSortRef.current.classList.contains('decrease')) {
        contentItemList.sort((a, b) => {
            const lastNameA = a.ho_ten ? a.ho_ten.split(' ').slice(-1)[0] : '';
            const lastNameB = b.ho_ten ? b.ho_ten.split(' ').slice(-1)[0] : '';
            return lastNameA.localeCompare(lastNameB);
        });
    }

    //return
    return (
        <div className={cx({ feature_wrapper: true })}>
            {/* head */}
            <div className={cx({ feature_page_head_wrapper: true })}>
                <h2 className={cx('title')}>Danh sách khách hàng</h2>
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
                            to={routesConfig.CustomerListDetail}
                            className={cx({
                                btn_add: true,
                            })}
                            onClick={() => {
                                contextDataConsumer.setContext({ ...contextDataConsumer.context, contentItem: {} });
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} className={cx({ btn_add_icon: true })} />
                            <span>Thêm khách hàng</span>
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

                        <input
                            className={cx({ search_input: true })}
                            value={searchGroupCustomer}
                            placeholder="Nhóm khách hàng"
                            onChange={(e) => {
                                setSearchGroupCustomer(e.target.value);
                            }}
                        />

                        <input
                            className={cx({ search_input: true })}
                            value={searchNation}
                            placeholder="Quốc gia"
                            onChange={(e) => {
                                setSearchNation(e.target.value);
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
                                    large: true,
                                    t_left: true,
                                })}
                            >
                                Nhóm khách hàng
                            </span>
                            <span
                                className={cx({
                                    content_header_item: true,
                                    medium: true,
                                    t_left: true,
                                })}
                            >
                                Quốc gia
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
                        {(searchName || searchGroupCustomer || searchNation ? searchResult : contentItemList).length ===
                        0 ? (
                            <div className={cx('empty_content')}>
                                <img src={images.emptyImage} alt="empty" />
                                <p>Không tồn tại khách hàng</p>
                                <Link
                                    to={routesConfig.CustomerListDetail}
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
                                    <span>Thêm khách hàng</span>
                                </Link>
                            </div>
                        ) : (
                            (searchName || searchGroupCustomer || searchNation ? searchResult : contentItemList).map(
                                (contentItem) => {
                                    return (
                                        <Link
                                            key={contentItem.id}
                                            className={cx({ content_item: true })}
                                            to={routesConfig.CustomerListDetail}
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
                                                        /*getPotentialCustomerByCode(contentItem.khach_hang_tiem_nang)
                                                        ? getPotentialCustomerByCode(contentItem.khach_hang_tiem_nang)
                                                              .ten : */
                                                        contentItem.ho_ten
                                                    }
                                                </span>
                                                <span
                                                    className={cx({
                                                        content_item_field: true,
                                                        text_regular: true,
                                                        large: true,
                                                        t_left: true,
                                                    })}
                                                >
                                                    {contentItem.nhom_khach_hang}
                                                </span>
                                                <span
                                                    className={cx({
                                                        content_item_field: true,
                                                        text_regular: true,
                                                        medium: true,
                                                        t_left: true,
                                                    })}
                                                >
                                                    {contentItem.quoc_gia}
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
                                },
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerList;
