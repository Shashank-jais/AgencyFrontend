export const baseURL = "http://localhost:5000"


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
    }

}

export default SummaryApi;