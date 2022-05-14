
export const loginService = {
    login,
    logout,
    authHeader
}

function logout(){
    localStorage.removeItem('localUser')
}

function authHeader(){
    console.log(localStorage.getItem('localUser'))
    let user = JSON.parse(localStorage.getItem('localUser'))
    if(user && user.authdata){
        return {'Authorization': 'Basic ' + user.authdata}
    } else {
        return {}
    }

}

function login(username, password){
    return fetch(process.env.REACT_APP_BACKEND_BASE + '/authentication', {
        method: 'GET',
        headers: {'Authorization': 'Basic ' + window.btoa(username + ':' + password)},
    }).then(response => {
        return response.json().then(data => {
            if(!response.ok){
                if( response.status === 401){
                    logout();
                }

                const error = (data && data.message) || response.statusText;
                return Promise.reject(error)
            }
            return data;
        })
    }).then(user => {
        if(user){
            user.authdata = window.btoa(username + ':' + password)
            localStorage.setItem('localUser', JSON.stringify(user))
        }
    })

}