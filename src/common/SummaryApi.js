export const baseURL = "https://ujalabackend.vercel.app"


const SummaryApi = {
    register: {
        url: `${baseURL}/api/user/register`,
        method: 'post'
    },
    login: {
        url: `${baseURL}/api/user/login`,
        method: 'post'
    },
    logout: {
        url: `${baseURL}/api/user/logout`,
        method: 'get'
    },
    addRecord: {
        url: `${baseURL}/api/addrecord`,
        method: 'post'
    },
    totalDetails: {
        url: `${baseURL}/api/totaldetails`,
        method: 'get'
    },
    logout:{
        url: `${baseURL}/api/user/logout`,
        method: 'get'
    },
    recordbyagencyid:{
        url: `${baseURL}/api/recordbyagencyid`,
        method: 'post'
    },
    updaterecord:{
        url: `${baseURL}/api/updaterecord`,
        method: 'post'
    },
    createUser:{
        url:`${baseURL}/api/user/register`,
        method:'post'
    },
    allUser:{
        url:`${baseURL}/api/user/allUser`,
        method:'get'
    }

}

export default SummaryApi;