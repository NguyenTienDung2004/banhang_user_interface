import HeadlessTippy from '@tippyjs/react/headless';
import FeatureItem from '~/component/FeatureItem/FeatureItem';
import { SearchIcon } from '~/component/icon';
import featureList from '~/featureList';
import { PopUpWrapper } from '~/component/PopUp';
import classNames from 'classnames/bind';
import styles from './headerSearch.module.scss';
import useDebouce from '~/hooks/useDebounce';
import { useEffect, useRef, useState } from 'react';

const cx = classNames.bind(styles);
function HeaderSearch() {
    const [inputValue, setInputValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showSearchResult, setShowSearchResult] = useState(false);

    const inputRef = useRef();
    const debounced = useDebouce(inputValue, 300);
    useEffect(() => {
        const result = featureList.filter((feature) => {
            return feature.featureName.toLowerCase().includes(debounced.toLowerCase());
        });
        setSearchResult(result);
    }, [debounced]);
    return (
        //còn tìm kiếm không phân biệt có dấu/không dấu
        <div>
            <HeadlessTippy
                interactive="true"
                visible={showSearchResult}
                render={(attrs) => (
                    <div className={cx('search_result')} tabIndex="-1" {...attrs}>
                        <PopUpWrapper>
                            {inputValue
                                ? searchResult.map((feature, index) => (
                                      <FeatureItem
                                          feature={feature}
                                          key={index}
                                          input={inputRef.current}
                                          setInputValue={setInputValue}
                                      />
                                  ))
                                : featureList.map((feature, index) => (
                                      <FeatureItem
                                          feature={feature}
                                          key={index}
                                          input={inputRef.current}
                                          setInputValue={setInputValue}
                                      />
                                  ))}
                        </PopUpWrapper>
                    </div>
                )}
            >
                <div className={cx('search')}>
                    <SearchIcon width="16" height="16" className={cx('icon_search')} />
                    <input
                        ref={inputRef}
                        value={inputValue}
                        type="text"
                        placeholder="Tìm kiếm hoặc gõ lệnh (Ctrl + G)"
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => setShowSearchResult(true)}
                        onBlur={() => {
                            setShowSearchResult(false);
                        }}
                    />
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default HeaderSearch;
