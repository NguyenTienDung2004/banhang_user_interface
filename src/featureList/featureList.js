import routesConfig from "~/configs/routesConfigs"

const featureList = [
    {
        featureName: 'Khách hàng tiềm năng',
        featurePath: routesConfig.PotentialCustomer
    },
    {
        featureName: 'Cơ hội',
        featurePath: routesConfig.Opportunity
    },
    {
        featureName: 'Danh sách khách hàng',
        featurePath: routesConfig.CustomerList
    },
    {
        featureName: 'Liên lạc',
        featurePath: routesConfig.Contact
    },
    {
        featureName: 'Hội thoại',
        featurePath: routesConfig.Conversation
    },
    {
        featureName: 'Nguồn khách hàng tiềm năng',
        featurePath: routesConfig.SrcPotentialCustomer
    },
    {
        featureName: 'Hợp đồng',
        featurePath: routesConfig.Contract
    },
    {
        featureName: 'Cuộc hẹn',
        featurePath: routesConfig.Appointment
    },
    {
        featureName: 'Đăng ký nhận bản tin',
        featurePath: routesConfig.SubscribeReceiveNewsletter
    },
    
]

export default featureList