import axios from "axios";

const url = "http://localhost:3000/api"
export const api = {
    async get(path: string) {
        console.log(`get on ${url}/${path}`)
        try {
            const response = await axios.get(`${url}/${path}`);
            return response.data.data
        } catch (error: any) {
            throw error.response.data.data.error
        }
    },
    async post(path: string, data: any) {
        console.log(`post on ${url}/${path}`)
        try {
            const response = await axios.post(`${url}/${path}`, data);
            return response.data.data
        } catch (error: any) {
            throw error.response.data.data.error;
        }
    },
    async delete(path: string) {
        console.log(`delete on ${url}/${path}`)
        try {
            const response = await axios.delete(`${url}/${path}`);
            return response.data.data
        } catch (error: any) {
            throw error.response.data.data.error
        }
    },
}