import styles from './conversationDetail.module.scss';
import classNames from 'classnames/bind';
import { contextData } from '~/component/ContextData/ContextData';
import { useContext, useRef, useState } from 'react';
import * as createService from '~/apiService/createService';
import * as updateService from '~/apiService/updateService';

const cx = classNames.bind(styles);
function ConversationDetail() {
    const contextDataConsumer = useContext(contextData);
    const contentItem = contextDataConsumer.context.contentItem;
    const [contentItemState, setContentItemState] = useState(contentItem);

    const inputReceiverRef = useRef();
    const inputTitleRef = useRef();

    // handle save
    async function handleSave() {
        try {
            let response;
            if (Object.keys(contentItem).length === 0) {
                response = await createService.createNewConversation(contentItemState);
            } else response = await updateService.updateConversationr(contentItem.id, contentItemState);

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
                    {Object.keys(contentItem).length === 0 ? 'Thêm hội thoại' : contentItem.chu_de}
                </h2>
                <div className={cx({ feature_detailt_action_container: true })}>
                    <button
                        className={cx({
                            btn_save: true,
                        })}
                        onClick={() => {
                            if (
                                !inputReceiverRef.current.value &&
                                (contentItemState.den === '' ||
                                    typeof contentItemState.den === 'undefined' ||
                                    contentItemState.den === null)
                            ) {
                                alert('Vui lòng nhập thông tin cho trường: Đến');
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
                    <div className={cx({ input_group_content: true })}>
                        <div
                            className={cx({
                                input_item_container: true,
                                a_center: true,
                            })}
                        >
                            <label htmlFor="inputReceiver">Đến</label>
                            <input
                                ref={inputReceiverRef}
                                type="text"
                                id="inputReceiver"
                                value={contentItemState.den ? contentItemState.den : ''}
                                onChange={(e) =>
                                    setContentItemState({
                                        ...contentItemState,
                                        den: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className={cx({ input_group: true })}>
                    <div className={cx({ input_group_content: true })}>
                        <div
                            className={cx({
                                input_item_container: true,
                                a_center: true,
                            })}
                        >
                            <label htmlFor="inputTitle">Chủ đề</label>
                            <input
                                ref={inputTitleRef}
                                type="text"
                                id="inputTitle"
                                value={contentItemState.chu_de ? contentItemState.chu_de : ''}
                                onChange={(e) =>
                                    setContentItemState({
                                        ...contentItemState,
                                        chu_de: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className={cx({ input_group_content: true })}>
                        <div className={cx({ input_item_container: true })}>
                            <label htmlFor="">Lời nhắn</label>
                            <textarea
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

export default ConversationDetail;
