import { useEffect, useState } from 'react';

function useDebouce(value, timeout) {
    const [debouceValue, setDebounceValue] = useState('');
    useEffect(() => {
        const handleTimeout = setTimeout(() => {
            setDebounceValue(value);
        }, timeout);
        return () => clearTimeout(handleTimeout);
    }, [value]);

    return debouceValue;
}

export default useDebouce;
