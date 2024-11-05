import { createContext, useEffect, useState } from 'react';
export const contextData = createContext();

function ContextData({ children }) {
    const [context, setContext] = useState(() => {
        const storedData = localStorage.getItem('contextData');
        return storedData ? JSON.parse(storedData) : {};
    });

    useEffect(() => {
        localStorage.setItem('contextData', JSON.stringify(context));
    }, [context]);
    return <contextData.Provider value={{ context, setContext }}>{children}</contextData.Provider>;
}

export default ContextData;
