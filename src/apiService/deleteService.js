import * as request from '~/utils/httpRequest';

export const deletePotentialCustomer = async (id) => {
    try {
        const res = await request.del(`KHTN/${id}`);
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const deleteAppointment = async (id) => {
    try {
        const res = await request.del(`CH/${id}`);
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const deleteSrcPotentialCustomer = async (id) => {
    try {
        const res = await request.del(`NKHTN/${id}`);
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const deleteConversation = async (id) => {
    try {
        const res = await request.del(`HT/${id}`);
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const deleteSubscribeReceiveNewslettern = async (id) => {
    try {
        const res = await request.del(`DK/${id}`);
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const deleteContact = async (id) => {
    try {
        const res = await request.del(`LL/${id}`);
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const deleteCustomer = async (id) => {
    try {
        const res = await request.del(`DSKH/${id}`);
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const deleteOpportunity = async (id) => {
    try {
        const res = await request.del(`cohoi/${id}`);
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const deleteContract = async (id) => {
    try {
        const res = await request.del(`HD/${id}`);
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};