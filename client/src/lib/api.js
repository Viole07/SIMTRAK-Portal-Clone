import axios from 'axios'
export const api = axios.create({ baseURL: 'http://localhost:4000/api', withCredentials: true })
export const setToken = (t) => { api.defaults.headers.common.Authorization = t ? `Bearer ${t}` : '' }