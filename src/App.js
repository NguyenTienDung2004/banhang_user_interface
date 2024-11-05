import Home from '~/pages/Home/Home';
import LogIn from '~/pages/LogIn/LogIn';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
function App() {
    const [isAuthenticate, setIsAuthenticate] = useState(false);
    return (
        <div>
            <Routes>
                <Route path="/login" element={<LogIn setIsAuthenticate={setIsAuthenticate} />} />
                <Route path="*" element={isAuthenticate ? <Home /> : <Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

export default App;
