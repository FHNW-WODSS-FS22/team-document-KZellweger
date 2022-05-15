export default function sendMessages(messages){
    const headers = new Headers()
    const user = JSON.parse(localStorage.getItem('localUser'))
    if(user && user.authdata){
        headers.append('Authorization', 'Basic ' + user.authdata)
    }
    headers.append('Content-Type', 'application/json')
    return fetch(process.env.REACT_APP_BACKEND_BASE + '/message', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(messages)
    }).then(response => {
        // console.log("Response for " + response?.url + " with status: " + response?.status);
    }).catch(error => console.error(error))
}