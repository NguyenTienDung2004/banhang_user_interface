import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './conversation.module.scss';
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

function Conversation() {
    const contextDataConsumer = useContext(contextData);
    const [idContentItemDeleted, setIdContentItemDeleted] = useState(() => {
        return contextDataConsumer.context.idContentItemDeleted || [];
    });
    let [contentItemList, setContentItemList] = useState([]);

    //state search
    const [searchTitle, setSearchTitle] = useState('');
    const [searchReceiver, setSearchReceiver] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const checkAllRef = useRef();
    const btnSortRef = useRef();

    if (checkAllRef.current) {
        idContentItemDeleted.length === contentItemList.length && contentItemList.length > 0
            ? (checkAllRef.current.checked = true)
            : (checkAllRef.current.checked = false);
    }

    //get potential customer from API
    useEffect(() => {
        const getContentItemList = async () => {
            const response = await getService.getConversation();
            const data = response.sort((a, b) => {
                const lastNameA = a.chu_de ? a.chu_de.split(' ').slice(-1)[0] : '';
                const lastNameB = b.chu_de ? b.chu_de.split(' ').slice(-1)[0] : '';
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
            const matchTitle = searchTitle ? item.chu_de.toLowerCase().includes(searchTitle.toLowerCase()) : true;
            const matchReceiver = searchReceiver ? item.den.toLowerCase().includes(searchReceiver.toLowerCase()) : true;

            return matchTitle && matchReceiver;
        });
        setSearchResult(result);
    }, [searchTitle, searchReceiver]);

    //handle delete
    async function handleDelete() {
        try {
            const deleteRequests = idContentItemDeleted.map((id) => deleteService.deleteConversation(id));
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
            const response = await getService.getConversation();
            const data = response.sort((a, b) => {
                const lastNameA = a.chu_de ? a.chu_de.split(' ').slice(-1)[0] : '';
                const lastNameB = b.chu_de ? b.chu_de.split(' ').slice(-1)[0] : '';
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
            const response = await updateService.updateConversationr(contentItem.id, updatedContentItem);
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
                    const lastNameA = a.chu_de ? a.chu_de.split(' ').slice(-1)[0] : '';
                    const lastNameB = b.chu_de ? b.chu_de.split(' ').slice(-1)[0] : '';
                    return lastNameA.localeCompare(lastNameB);
                });
                return sortedList;
            });
        } else {
            e.target.classList.add('decrease');
            setContentItemList((prevContentItemList) => {
                const sortedList = [...prevContentItemList].sort((a, b) => {
                    const lastNameA = a.chu_de ? a.chu_de.split(' ').slice(-1)[0] : '';
                    const lastNameB = b.chu_de ? b.chu_de.split(' ').slice(-1)[0] : '';
                    return lastNameB.localeCompare(lastNameA);
                });
                return sortedList;
            });
        }
    }

    if (btnSortRef.current && btnSortRef.current.classList.contains('decrease')) {
        contentItemList.sort((a, b) => {
            const lastNameA = a.chu_de ? a.chu_de.split(' ').slice(-1)[0] : '';
            const lastNameB = b.chu_de ? b.chu_de.split(' ').slice(-1)[0] : '';
            return lastNameB.localeCompare(lastNameA);
        });
    } else if (btnSortRef.current && !btnSortRef.current.classList.contains('decrease')) {
        contentItemList.sort((a, b) => {
            const lastNameA = a.chu_de ? a.chu_de.split(' ').slice(-1)[0] : '';
            const lastNameB = b.chu_de ? b.chu_de.split(' ').slice(-1)[0] : '';
            return lastNameA.localeCompare(lastNameB);
        });
    }

    //return
    return (
        <div className={cx({ feature_wrapper: true })}>
            {/* head */}
            <div className={cx({ feature_page_head_wrapper: true })}>
                <h2 className={cx('title')}>Hội thoại</h2>
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
                            to={routesConfig.ConversationDetail}
                            className={cx({
                                btn_add: true,
                            })}
                            onClick={() => {
                                contextDataConsumer.setContext({ ...contextDataConsumer.context, contentItem: {} });
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} className={cx({ btn_add_icon: true })} />
                            <span>Thêm hội thoại</span>
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
                            value={searchTitle}
                            placeholder="Chủ đề"
                            onChange={(e) => {
                                setSearchTitle(e.target.value);
                            }}
                        />

                        <input
                            className={cx({ search_input: true })}
                            placeholder="Người nhận"
                            value={searchReceiver}
                            onChange={(e) => {
                                setSearchReceiver(e.target.value);
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
                                Chủ đề
                            </span>
                            <span
                                className={cx({
                                    content_header_item: true,
                                    medium: true,
                                    t_left: true,
                                })}
                            >
                                Người nhận
                            </span>
                            <span
                                className={cx({
                                    content_header_item: true,
                                    medium: true,
                                    t_left: true,
                                })}
                            >
                                Lời nhắn
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
                        {(searchTitle || searchReceiver ? searchResult : contentItemList).length === 0 ? (
                            <div className={cx('empty_content')}>
                                <img src={images.emptyImage} alt="empty" />
                                <p>Không tồn tại hội thoại</p>
                                <Link
                                    to={routesConfig.ConversationDetail}
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
                                    <span>Thêm hội thoại</span>
                                </Link>
                            </div>
                        ) : (
                            (searchTitle || searchReceiver ? searchResult : contentItemList).map((contentItem) => {
                                return (
                                    <Link
                                        key={contentItem.id}
                                        className={cx({ content_item: true })}
                                        to={routesConfig.ConversationDetail}
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
                                                {contentItem.chu_de}
                                            </span>
                                            <span
                                                className={cx({
                                                    content_item_field: true,
                                                    text_regular: true,
                                                    medium: true,
                                                    t_left: true,
                                                })}
                                            >
                                                {contentItem.den}
                                            </span>
                                            <span
                                                className={cx({
                                                    content_item_field: true,
                                                    text_regular: true,
                                                    medium: true,
                                                    t_left: true,
                                                })}
                                            >
                                                {contentItem.loi_nhan}
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

export default Conversation;
