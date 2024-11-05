import routesConfig from "~/configs/routesConfigs"

const featureGroups = [
    {
        groupTitle: 'Bán hàng',
        featureList: [
            {
                featureName: 'Khách hàng tiềm năng',
                isMainFeature: true,
                to: routesConfig.PotentialCustomer
            },
            {
                featureName: 'Cơ hội',
                isMainFeature: true,
                to: routesConfig.Opportunity
            },
            {
                featureName: 'Danh sách khách hàng',
                isMainFeature: true,
                to: routesConfig.CustomerList
            },
            {
                featureName: 'Liên lạc',
                isMainFeature: true,
                to: routesConfig.Contact
            },
            {
                featureName: 'Hội thoại',
                isMainFeature: false,
                to: routesConfig.Conversation
            },
            {
                featureName: 'Nguồn khách hàng tiềm năng',
                isMainFeature: false,
                to: routesConfig.SrcPotentialCustomer
            },
            {
                featureName: 'Hợp đồng',
                isMainFeature: false,
                to: routesConfig.Contract
            },
            {
                featureName: 'Cuộc hẹn',
                isMainFeature: false,
                to: routesConfig.Appointment
            },
            {
                featureName: 'Đăng ký nhận bản tin',
                isMainFeature: false,
                to: routesConfig.SubscribeReceiveNewsletter
            },
        ]
    }
]

export default featureGroups