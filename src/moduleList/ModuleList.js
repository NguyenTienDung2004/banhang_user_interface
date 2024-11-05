import routesConfig from "~/configs/routesConfigs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBagShopping, faBox, faBriefcase, faBuilding, faCartShopping, faChartPie, faCoins, faCreditCard, faFolder, faFolderOpen, faGears, faHandHoldingDollar, faHouse, faMoneyBills, faPager, faPhone, faPlug, faScrewdriverWrench, faShieldHalved, faSliders, faToolbox, faUserGroup } from "@fortawesome/free-solid-svg-icons"
const ModuleGroups = [
    {
        titleModuleGroup: 'BỘ PHẬN',
        listModuleItem: [
            {       
                id: 0,
                moduleIcon: <FontAwesomeIcon icon={faHouse}/>,
                moduleName: 'Trang chủ',
                modulePath: routesConfig.NotRelease,
            },
            {       
                id: 1,
                moduleIcon: <FontAwesomeIcon icon={faMoneyBills}/>,
                moduleName: 'Kế toán',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 2,
                moduleIcon: <FontAwesomeIcon icon={faBagShopping}/>,
                moduleName: 'Tài sản',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 3,
                moduleIcon: <FontAwesomeIcon icon={faScrewdriverWrench}/>,
                moduleName: 'Build',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 4,
                moduleIcon: <FontAwesomeIcon icon={faCartShopping}/>,
                moduleName: 'Mua hàng',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 5,
                moduleIcon: <FontAwesomeIcon icon={faChartPie}/>,
                moduleName: 'CRM',
                modulePath: routesConfig.CRM,
            },
            {   
                id: 6,
                moduleIcon: <FontAwesomeIcon icon={faBriefcase}/>,
                moduleName: 'Nhân sự',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 7,
                moduleIcon: <FontAwesomeIcon icon={faHandHoldingDollar}/>,
                moduleName: 'Khoản vay',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 8,
                moduleIcon: <FontAwesomeIcon icon={faCoins}/>,
                moduleName: 'Bảng lương',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 9,
                moduleIcon: <FontAwesomeIcon icon={faFolderOpen}/>,
                moduleName: 'Dự án',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 10,
                moduleIcon: <FontAwesomeIcon icon={faShieldHalved}/>,
                moduleName: 'Chất lượng',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 11,
                moduleIcon: <FontAwesomeIcon icon={faCreditCard}/>,
                moduleName: 'Bán hàng',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 12,
                moduleIcon: <FontAwesomeIcon icon={faBox}/>,
                moduleName: 'Kho',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 13,
                moduleIcon: <FontAwesomeIcon icon={faPhone}/>,
                moduleName: 'Hỗ trợ',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 14,
                moduleIcon: <FontAwesomeIcon icon={faPager}/>,
                moduleName: 'Website',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 15,
                moduleIcon: <FontAwesomeIcon icon={faGears}/>,
                moduleName: 'Cài đặt',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 16,
                moduleIcon: <FontAwesomeIcon icon={faFolder}/>,
                moduleName: 'Tiện ích',
                modulePath: routesConfig.NotRelease,
            },
        ]
    },
    {
        titleModuleGroup: 'TÊN MIỀN',
        listModuleItem:[
            {   
                id: 17,
                moduleIcon: <FontAwesomeIcon icon={faBuilding}/>,
                moduleName: 'Sản xuất',
                modulePath: routesConfig.NotRelease,
            },
        ]
    },
    {
        titleModuleGroup: 'QUẢN TRỊ',
        listModuleItem:[
            {   
                id: 18,
                moduleIcon: <FontAwesomeIcon icon={faSliders}/>,
                moduleName: 'Tùy biến',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 19,
                moduleIcon: <FontAwesomeIcon icon={faPlug}/>,
                moduleName: 'Tích hợp',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 20,
                moduleIcon: <FontAwesomeIcon icon={faToolbox}/>,
                moduleName: 'Công cụ',
                modulePath: routesConfig.NotRelease,
            },
            {   
                id: 21,
                moduleIcon: <FontAwesomeIcon icon={faUserGroup}/>,
                moduleName: 'Người sử dụng',
                modulePath: routesConfig.NotRelease,
            },
        ]
    }
]

export default ModuleGroups