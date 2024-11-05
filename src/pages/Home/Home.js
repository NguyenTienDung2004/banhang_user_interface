import { Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import publicRoutes from '~/routes';
import { MainLayout } from '~/layouts';

function Home() {
    return (
        <div>
            <Routes>
                {publicRoutes.map((route, index) => {
                    let Layout = MainLayout;
                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                route.layout === null ? (
                                    <Layout>
                                        <route.component />
                                    </Layout>
                                ) : (
                                    <Layout data={route}>
                                        <route.component />
                                    </Layout>
                                )
                            }
                        />
                    );
                })}
            </Routes>
        </div>
    );
}

export default Home;
