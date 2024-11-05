import * as request from '~/utils/httpRequest';

export const updatePotentialCustomer = async (id, updatedContentItem) => {
    try {
        const res = await request.update(`KHTN/${id}`, updatedContentItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const updateAppointment = async (id, updatedContentItem) => {
    try {
        const res = await request.update(`CH/${id}`, updatedContentItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const updateSrcPotentialCustomer = async (id, updatedContentItem) => {
    try {
        const res = await request.update(`NKHTN/${id}`, updatedContentItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const updateConversationr = async (id, updatedContentItem) => {
    try {
        const res = await request.update(`HT/${id}`, updatedContentItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const updateSubscribeReceiveNewsletter = async (id, updatedContentItem) => {
    try {
        const res = await request.update(`DK/${id}`, updatedContentItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const updateContact = async (id, updatedContentItem) => {
    try {
        const res = await request.update(`LL/${id}`, updatedContentItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

export const updateCustomer = async (id, updatedContentItem) => {
    try {
        const res = await request.update(`DSKH/${id}`, updatedContentItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};


export const updateOpportunity = async (id, updatedContentItem) => {
    try {
        const res = await request.update(`cohoi/${id}`, updatedContentItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};


export const updateContract = async (id, updatedContentItem) => {
    try {
        const res = await request.update(`HD/${id}`, updatedContentItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};