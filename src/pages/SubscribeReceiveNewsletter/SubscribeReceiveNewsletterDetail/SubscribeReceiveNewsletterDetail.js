import styles from './subscribeReceiveNewsletterDetail.module.scss';
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
function SubscribeReceiveNewsletterDetail() {
    const contextDataConsumer = useContext(contextData);
    const contentItem = contextDataConsumer.context.contentItem;
    const [contentItemState, setContentItemState] = useState(contentItem);

    const inputSenderRef = useRef();
    const inputReceiverRef = useRef();
    const inputTitleRef = useRef();
    const selectInputRef = useRef();
    const tippyRef = useRef();

    const [staffList, setStaffList] = useState([]);
    
    //get staff
    async function getStaff() {
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
        getStaff();
    }, []);

    const [sender, setSender] = useState();
    const [showSender, setShowSender] = useState(false);
    const [SenderSearchResult, setSenderSearchResult] = useState([]);

    //search staff
    let debounced = useDebouce(sender?sender:'', 300);
    useEffect(() => {
        const result = staffList.filter((staff) => {
            return staff.email.toLowerCase().includes(debounced.toLowerCase());
        });
        setSenderSearchResult(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    //xử lý độ rộng của các tippy sao cho phù hợp với input của chúng
    useEffect(() => {
        const handleResize = () => {
            tippyRef.current.style.width = selectInputRef.current.offsetWidth + 'px';
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
                response = await createService.createNewSubscribeReceiveNewsletter(contentItemState);
            } else response = await updateService.updateSubscribeReceiveNewsletter(contentItem.id, contentItemState);

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
                    {Object.keys(contentItem).length === 0 ? 'Thêm đăng ký nhận bản tin' : contentItem.chu_de}
                </h2>
                <div className={cx({ feature_detailt_action_container: true })}>
                    <button
                        className={cx({
                            btn_save: true,
                        })}
                        onClick={() => {
                            if (
                                !inputSenderRef.current.value &&
                                (contentItemState.nguoi_gui === '' ||
                                    typeof contentItemState.nguoi_gui === 'undefined' ||
                                    contentItemState.nguoi_gui === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Email người gửi');
                            } else if (
                                !inputReceiverRef.current.value &&
                                (contentItemState.email_nhom === '' ||
                                    typeof contentItemState.email_nhom === 'undefined' ||
                                    contentItemState.email_nhom === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Email người nhận');
                            } else if (
                                !inputTitleRef.current.value &&
                                (contentItemState.chu_de === '' ||
                                    typeof contentItemState.chu_de === 'undefined' ||
                                    contentItemState.chu_de === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Chủ đề');
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
                    <h2 className={cx({ input_group_title: true })}>Người Gửi</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_sender">Email người gửi</label>
                                <HeadlessTippy
                                    ref={selectInputRef}
                                    interactive="true"
                                    visible={showSender}
                                    placement="bottom"
                                    render={(attrs) => (
                                        <div
                                            ref={tippyRef}
                                            className={cx({ select_input: true })}
                                            tabIndex="-1"
                                            {...attrs}
                                            style={{
                                                width: selectInputRef.current.offsetWidth + 'px',
                                            }}
                                        >
                                            <PopUpWrapper>
                                                {sender
                                                    ? SenderSearchResult.map((item) => (
                                                          <div
                                                              key={item.id}
                                                              className={cx({ select_input_item: true })}
                                                              onMouseDown={(e) => e.preventDefault()}
                                                              onClick={() => {
                                                                  inputSenderRef.current.value = item.email;
                                                                  setSender(item.email);
                                                                  inputSenderRef.current.blur();
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
                                                                  inputSenderRef.current.value = item.email;
                                                                  setSender(item.email);
                                                                  inputSenderRef.current.blur();
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
                                        ref={inputSenderRef}
                                        type="text"
                                        id="input_sender"
                                        autoComplete="off"
                                        value={
                                            typeof sender == 'undefined' && getStaffByCode(contentItemState.nguoi_gui)
                                                ? getStaffByCode(contentItemState.nguoi_gui).email
                                                : !sender
                                                ? ''
                                                : sender
                                        }
                                        onChange={(e) => {
                                            if (!e.target.value.startsWith(' ')) {
                                                setSender(e.target.value === '' ? null : e.target.value);
                                            }
                                        }}
                                        onFocus={() => {
                                            setShowSender(true);
                                        }}
                                        onBlur={(e) => {
                                            setShowSender(false);
                                            console.log(e.target.value);
                                            const staff = staffList.find((item) => item.email === e.target.value);
                                            if (staff) {
                                                setContentItemState({
                                                    ...contentItemState,
                                                    nguoi_gui: staff.ma_nv,
                                                });
                                            } else {
                                                setSender('');
                                                setContentItemState({
                                                    ...contentItemState,
                                                    nguoi_gui: null,
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
                    <h2 className={cx({ input_group_title: true })}>Người Nhận</h2>
                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ two_col: true })}>
                            <div className={cx({ input_item_container: true })}>
                                <label htmlFor="input_receiver">Email người nhận</label>
                                <input
                                    ref={inputReceiverRef}
                                    type="text"
                                    id="input_receiver"
                                    autoComplete="off"
                                    value={contentItemState.email_nhom ? contentItemState.email_nhom : ''}
                                    onChange={(e) => {
                                        !e.target.value.startsWith(' ') &&
                                            setContentItemState({
                                                ...contentItemState,
                                                email_nhom: e.target.value === '' ? null : e.target.value,
                                            });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* group3 */}
                <div className={cx({ input_group: true })}>
                    <h2 className={cx({ input_group_title: true })}>Nội Dung</h2>
                    <div className={cx({ input_group_content: true, d_block: true })}>
                        <div className={cx({ input_item_container: true })}>
                            <label htmlFor="input_title">Chủ đề</label>
                            <textarea
                                ref={inputTitleRef}
                                id="input_title"
                                className={cx({ m_height_100: true })}
                                autoComplete="off"
                                value={contentItemState.chu_de ? contentItemState.chu_de : ''}
                                onChange={(e) => {
                                    !e.target.value.startsWith(' ') &&
                                        setContentItemState({
                                            ...contentItemState,
                                            chu_de: e.target.value === '' ? null : e.target.value,
                                        });
                                }}
                            ></textarea>
                        </div>
                        <div className={cx({ input_item_container: true })}>
                            <label htmlFor="input_message">Lời nhắn</label>
                            <textarea
                                id="input_message"
                                value={contentItemState.loi_nhan ? contentItemState.loi_nhan : ''}
                                onChange={(e) => {
                                    !e.target.value.startsWith(' ') &&
                                        setContentItemState({
                                            ...contentItemState,
                                            loi_nhan: e.target.value === '' ? null : e.target.value,
                                        });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubscribeReceiveNewsletterDetail;
