const useSendMessages = (dispatch) => {
    return (messages) => {
        const headers = new Headers()
        const user = JSON.parse(localStorage.getItem('localUser'))
        if (user && user.authdata) {
            headers.append('Authorization', 'Basic ' + user.authdata)
        }
        headers.append('Content-Type', 'application/json')
        return fetch(process.env.REACT_APP_BACKEND_BASE + '/message', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(messages)
        }).then(response => {
            if (response.status < 200 || response.status > 299) {
                dispatch({type: 'ERROR', payload: { isPresent: true, isBlocking: true, message: "An error occured and your changes could not be saved." }})
            }
        })
    }

}

export default useSendMessages;
