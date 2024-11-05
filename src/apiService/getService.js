import * as request from '~/utils/httpRequest';

export const getStaff = async () => {
    try {
        const res = await request.get('NV');
        return res.data;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const getPotentialCustomerList = async () => {
    try {
        const res = await request.get('KHTN');
        return res.data;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const getAppointment = async () => {
    try {
        const res = await request.get('CH');
        return res.data;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const getSrcPotentialCustomer = async () => {
    try {
        const res = await request.get('NKHTN');
        return res.data;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const getConversation = async () => {
    try {
        const res = await request.get('HT');
        return res.data;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const getSubscribeReceiveNewsletter = async () => {
    try {
        const res = await request.get('DK');
        return res.data;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const getContact = async () => {
    try {
        const res = await request.get('LL');
        return res.data;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};


export const getCustomerList = async () => {
    try {
        const res = await request.get('DSKH');
        return res.data;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};


export const getOpportunity = async () => {
    try {
        const res = await request.get('cohoi');
        return res.data;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const getContract = async () => {
    try {
        const res = await request.get('HD');
        return res.data;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};