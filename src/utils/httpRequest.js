import axios from 'axios';
const request = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

export const get = async (path, optionConfig) => {
    const res = await request.get(path, optionConfig);
    return res.data;
};

export const del = async (path, optionConfig) => {
    const res = await request.delete(path, optionConfig);
    return res.data;
};

export const update = async (path, updatedContentItem, optionConfig) => {
    const res = await request.patch(path, updatedContentItem, optionConfig);
    return res.data;
};

export const post = async (path, newItem, optionConfig) => {
    const res = await request.post(path, newItem, optionConfig);
    return res.data;
};

export default request;
