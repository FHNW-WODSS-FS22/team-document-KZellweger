
const sendMessages = (dispatch) => {
    return (body, subPath = '') => {
        const headers = new Headers()
        const user = JSON.parse(localStorage.getItem('localUser'))
        if (user && user.authdata) {
            headers.append('Authorization', 'Basic ' + user.authdata)
        }
        if (body) {
            headers.append('Content-Type', 'application/json')
        }
        return fetch(process.env.REACT_APP_BACKEND_BASE + '/message' + subPath, {
            method: 'POST',
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
