import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './contract.module.scss';
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

function Contract() {
    const contextDataConsumer = useContext(contextData);
    const [idContentItemDeleted, setIdContentItemDeleted] = useState(() => {
        return contextDataConsumer.context.idContentItemDeleted || [];
    });
    let [contentItemList, setContentItemList] = useState([]);

    const [customerList, setCustomerList] = useState([]);

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

    useEffect(() => {
        getCustomerListFromAPI();
    }, []);

    //state search
    const [searchName, setSearchName] = useState('');
    const [searchPartnerType, setSearchPartnerType] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const checkAllRef = useRef();
    const btnSortRef = useRef();

    if (checkAllRef.current) {
        idContentItemDeleted.length === contentItemList.length && contentItemList.length > 0
            ? (checkAllRef.current.checked = true)
            : (checkAllRef.current.checked = false);
    }

    //get contract from API
    useEffect(() => {
        const getContentItemList = async () => {
            const response = await getService.getContract();
            const data = response.sort((a, b) => {
                const lastNameA = getCustomerByCode(a.ten_doi_tac)
                    ? getCustomerByCode(a.ten_doi_tac).ho_ten.split(' ').slice(-1)[0]
                    : '';
                const lastNameB = getCustomerByCode(b.ten_doi_tac)
                    ? getCustomerByCode(b.ten_doi_tac).ho_ten.split(' ').slice(-1)[0]
                    : '';
                return lastNameA.localeCompare(lastNameB);
            });
            setContentItemList(data);
        };
        getContentItemList();
    }, [idContentItemDeleted]);

    //set setContext while idContentItemDeleted is changed
    useEffect(() => {
        contextDataConsumer.setContext({
            ...contextDataConsumer.context,
            idContentItemDeleted: idContentItemDeleted,
        });
        idContentItemDeleted.length === contentItemList.length
            ? (checkAllRef.current.checked = true)
            : (checkAllRef.current.checked = false);
    }, [idContentItemDeleted]);

    //handle search
    useEffect(() => {
        const result = contentItemList.filter((item) => {
            const matchName = searchName
                ? getCustomerByCode(item.ten_doi_tac)
                    ? getCustomerByCode(item.ten_doi_tac).ho_ten.toLowerCase().includes(searchName.toLowerCase())
                    : ''
                : true;
            const matchPartnerType = searchPartnerType
                ? item.loai_doi_tac.toLowerCase().includes(searchPartnerType.toLowerCase())
                : true;

            return matchName && matchPartnerType;
        });
        setSearchResult(result);
    }, [searchName, searchPartnerType]);

    //handle delete
    async function handleDelete() {
        try {
            const deleteRequests = idContentItemDeleted.map((id) => deleteService.deleteContract(id));
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
            const response = await getService.getContract();
            const data = response.sort((a, b) => {
                const lastNameA = getCustomerByCode(a.ten_doi_tac).ho_ten
                    ? getCustomerByCode(a.ten_doi_tac).ho_ten.split(' ').slice(-1)[0]
                    : '';
                const lastNameB = getCustomerByCode(b.ten_doi_tac).ho_ten
                    ? getCustomerByCode(b.ten_doi_tac).ho_ten.split(' ').slice(-1)[0]
                    : '';
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
            const response = await updateService.updateContract(contentItem.id, updatedContentItem);
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
                    const lastNameA = getCustomerByCode(a.ten_doi_tac).ho_ten
                        ? getCustomerByCode(a.ten_doi_tac).ho_ten.split(' ').slice(-1)[0]
                        : '';
                    const lastNameB = getCustomerByCode(b.ten_doi_tac).ho_ten
                        ? getCustomerByCode(b.ten_doi_tac).ho_ten.split(' ').slice(-1)[0]
                        : '';
                    return lastNameA.localeCompare(lastNameB);
                });
                return sortedList;
            });
        } else {
            e.target.classList.add('decrease');
            setContentItemList((prevContentItemList) => {
                const sortedList = [...prevContentItemList].sort((a, b) => {
                    const lastNameA = getCustomerByCode(a.ten_doi_tac).ho_ten
                        ? getCustomerByCode(a.ten_doi_tac).ho_ten.split(' ').slice(-1)[0]
                        : '';
                    const lastNameB = getCustomerByCode(b.ten_doi_tac).ho_ten
                        ? getCustomerByCode(b.ten_doi_tac).ho_ten.split(' ').slice(-1)[0]
                        : '';
                    return lastNameB.localeCompare(lastNameA);
                });
                return sortedList;
            });
        }
    }

    if (btnSortRef.current && btnSortRef.current.classList.contains('decrease')) {
        contentItemList.sort((a, b) => {
            const lastNameA = getCustomerByCode(a.ten_doi_tac).ho_ten
                ? getCustomerByCode(a.ten_doi_tac).ho_ten.split(' ').slice(-1)[0]
                : '';
            const lastNameB = getCustomerByCode(b.ten_doi_tac).ho_ten
                ? getCustomerByCode(b.ten_doi_tac).ho_ten.split(' ').slice(-1)[0]
                : '';
            return lastNameB.localeCompare(lastNameA);
        });
    } else if (btnSortRef.current && !btnSortRef.current.classList.contains('decrease')) {
        contentItemList.sort((a, b) => {
            const lastNameA = getCustomerByCode(a.ten_doi_tac)
                ? getCustomerByCode(a.ten_doi_tac).ho_ten.split(' ').slice(-1)[0]
                : '';
            const lastNameB = getCustomerByCode(b.ten_doi_tac)
                ? getCustomerByCode(b.ten_doi_tac).ho_ten.split(' ').slice(-1)[0]
                : '';
            return lastNameA.localeCompare(lastNameB);
        });
    }

    //return
    return (
        <div className={cx({ feature_wrapper: true })}>
            {/* head */}
            <div className={cx({ feature_page_head_wrapper: true })}>
                <h2 className={cx('title')}>Hợp đồng</h2>
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
                            to={routesConfig.ContractDetail}
                            className={cx({
                                btn_add: true,
                            })}
                            onClick={() => {
                                contextDataConsumer.setContext({ ...contextDataConsumer.context, contentItem: {} });
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} className={cx({ btn_add_icon: true })} />
                            <span>Thêm hợp đồng</span>
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
                            value={searchPartnerType}
                            onChange={(e) => {
                                setSearchPartnerType(e.target.value);
                            }}
                        >
                            <option value="">Loại đối tác</option>
                            <option value="Danh sách khách hàng">Danh sách khách hàng</option>
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
                                    large: true,
                                    t_left: true,
                                })}
                            >
                                Loại đối tác
                            </span>
                            <span
                                className={cx({
                                    content_header_item: true,
                                    medium: true,
                                    t_left: true,
                                })}
                            >
                                Điều khoản hợp đồng
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
                        {(searchName || searchPartnerType ? searchResult : contentItemList).length === 0 ? (
                            <div className={cx('empty_content')}>
                                <img src={images.emptyImage} alt="empty" />
                                <p>Không tồn tại hợp đồng</p>
                                <Link
                                    to={routesConfig.ContractDetail}
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
                                    <span>Thêm hợp đồng</span>
                                </Link>
                            </div>
                        ) : (
                            (searchName || searchPartnerType ? searchResult : contentItemList).map((contentItem) => {
                                return (
                                    <Link
                                        key={contentItem.id}
                                        className={cx({ content_item: true })}
                                        to={routesConfig.ContractDetail}
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
                                                {getCustomerByCode(contentItem.ten_doi_tac)
                                                    ? getCustomerByCode(contentItem.ten_doi_tac).ho_ten
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
                                                {contentItem.loai_doi_tac}
                                            </span>
                                            <span
                                                className={cx({
                                                    content_item_field: true,
                                                    text_regular: true,
                                                    medium: true,
                                                    t_left: true,
                                                })}
                                            >
                                                {contentItem.dieu_khoan_hop_dong}
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

export default Contract;
