
const sendMessages = (dispatch) => {
    return (body, subPath = '', method = 'POST') => {

        const headers = new Headers()
        const user = JSON.parse(localStorage.getItem('localUser'))
        if (user && user.authdata) {
            headers.append('Authorization', 'Basic ' + user.authdata)
        }
        headers.append('Content-Type', 'application/json')

        return fetch(process.env.REACT_APP_BACKEND_BASE + '/message' + subPath, {
            method: method,
            headers: headers,
            body: body ? JSON.stringify(body) : null
        }).then(response => {
            if (response.status < 200 || response.status > 299) {
                dispatch({type: 'ERROR', payload: { isPresent: true, message: "An error has occurred. \n Some of your changes may not have been saved." }})
            }
        })
    }
}

export default sendMessages;
