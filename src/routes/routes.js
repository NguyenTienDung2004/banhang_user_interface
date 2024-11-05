import routesConfig from '~/configs/routesConfigs';
import Appointment from '~/pages/Appointment/Appointment';
import Contact from '~/pages/Contact/Contact';
import Contract from '~/pages/Contract/Contract';
import Conversation from '~/pages/Conversation/Conversation';
import CRM from '~/pages/CRM/CRM';
import CustomerList from '~/pages/CustomerList/CustomerList';
import Opportunity from '~/pages/Opportunity/Oppotunity';
import PotentialCustomer from '~/pages/PotentialCustomer/PotentialCustomer';
import SrcPotentialCustomer from '~/pages/SrcPotentialCustomer/SrcPotentialCustomer';
import SubscribeReceiveNewsletter from '~/pages/SubscribeReceiveNewsletter/SubscribeReceiveNewsletter';
import NotRelease from '~/pages/NotReleased/NotRelease';
import PotentialCustomerDetail from '~/pages/PotentialCustomer/PotentialCustomerDetail';
import AppointmentDetail from '~/pages/Appointment/AppointmentDetail';
import SrcPotentialCustomerDetail from '~/pages/SrcPotentialCustomer/SrcPotentialCustomerDetail';
import ConversationDetail from '~/pages/Conversation/ConversationDetail';
import SubscribeReceiveNewsletterDetail from '~/pages/SubscribeReceiveNewsletter/SubscribeReceiveNewsletterDetail/SubscribeReceiveNewsletterDetail';
import ContactDetail from '~/pages/Contact/ContactDetail';
import CustomerListDetail from '~/pages/CustomerList/CustomerListDetail';
import OpportunityDetail from '~/pages/Opportunity/OpportunityDetail';
import ContractDetail from '~/pages/Contract/ContractDetail';

import { MainLayout, HeaderOnly } from '~/layouts';

const publicRoutes = [
    {
        path: routesConfig.CRM,
        component: CRM,
        layout: MainLayout,
        titlePage: 'CRM',
    },
    {
        path: routesConfig.Appointment,
        component: Appointment,
        layout: HeaderOnly,
        titlePage: 'Cuộc hẹn',
    },
    {
        path: routesConfig.Contact,
        component: Contact,
        layout: HeaderOnly,
        titlePage: 'Liên lạc',
    },
    {
        path: routesConfig.Contract,
        component: Contract,
        layout: HeaderOnly,
        titlePage: 'Hợp đồng',
    },
    {
        path: routesConfig.Conversation,
        component: Conversation,
        layout: HeaderOnly,
        titlePage: 'Hội thoại',
    },

    {
        path: routesConfig.CustomerList,
        component: CustomerList,
        layout: HeaderOnly,
        titlePage: 'Danh sách khách hàng',
    },
    {
        path: routesConfig.Opportunity,
        component: Opportunity,
        layout: HeaderOnly,
        titlePage: 'Cơ hội',
    },
    {
        path: routesConfig.PotentialCustomer,
        component: PotentialCustomer,
        layout: HeaderOnly,
        titlePage: 'Khách hàng tiềm năng',
    },
    {
        path: routesConfig.SrcPotentialCustomer,
        component: SrcPotentialCustomer,
        layout: HeaderOnly,
        titlePage: 'Nguồn khách hàng tiềm năng',
    },
    {
        path: routesConfig.SubscribeReceiveNewsletter,
        component: SubscribeReceiveNewsletter,
        layout: HeaderOnly,
        titlePage: 'Đăng ký nhận bản tin',
    },
    {
        path: routesConfig.PotentialCustomerDetail,
        component: PotentialCustomerDetail,
        layout: HeaderOnly,
        titlePage: 'Khách hàng tiềm năng',
    },
    {
        path: routesConfig.AppointmentDetail,
        component: AppointmentDetail,
        layout: HeaderOnly,
        titlePage: 'Cuộc hẹn',
    },
    {
        path: routesConfig.SrcPotentialCustomerDetail,
        component: SrcPotentialCustomerDetail,
        layout: HeaderOnly,
        titlePage: 'Nguồn khách hàng tiềm năng',
    },
    {
        path: routesConfig.ConversationDetail,
        component: ConversationDetail,
        layout: HeaderOnly,
        titlePage: 'Hội thoại',
    },
    {
        path: routesConfig.SubscribeReceiveNewsletterDetail,
        component: SubscribeReceiveNewsletterDetail,
        layout: HeaderOnly,
        titlePage: 'Đăng ký nhận bản tin',
    },
    {
        path: routesConfig.ContactDetail,
        component: ContactDetail,
        layout: HeaderOnly,
        titlePage: 'Liên lạc',
    },
    {
        path: routesConfig.CustomerListDetail,
        component: CustomerListDetail,
        layout: HeaderOnly,
        titlePage: 'Danh sách khách hàng',
    },
    {
        path: routesConfig.OpportunityDetail,
        component: OpportunityDetail,
        layout: HeaderOnly,
        titlePage: 'Cơ hội',
    },
    {
        path: routesConfig.ContractDetail,
        component: ContractDetail,
        layout: HeaderOnly,
        titlePage: 'Hợp đồng',
    },
    {
        path: routesConfig.NotRelease,
        component: NotRelease,
        layout: MainLayout,
        titlePage: 'Not Released',
    },
];

export default publicRoutes;
