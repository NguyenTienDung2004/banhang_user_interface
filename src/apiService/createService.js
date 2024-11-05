import * as request from '~/utils/httpRequest';

export const createNewPotentialCustomer = async (newItem) => {
    try {
        const res = request.post('KHTN', newItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const createNewAppointment = async (newItem) => {
    try {
        const res = request.post('CH', newItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const createNewSrcPotentialCustomer = async (newItem) => {
    try {
        const res = request.post('NKHTN', newItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const createNewConversation = async (newItem) => {
    try {
        const res = request.post('HT', newItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const createNewSubscribeReceiveNewsletter = async (newItem) => {
    try {
        const res = request.post('DK', newItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const createNewContact = async (newItem) => {
    try {
        const res = request.post('LL', newItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const createNewCustomer = async (newItem) => {
    try {
        const res = request.post('DSKH', newItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const createNewOpportunity = async (newItem) => {
    try {
        const res = request.post('cohoi', newItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const createNewContract = async (newItem) => {
    try {
        const res = request.post('HD', newItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};
