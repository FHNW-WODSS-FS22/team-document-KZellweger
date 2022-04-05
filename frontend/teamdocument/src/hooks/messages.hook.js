export function sendMessage(message) {
    return fetch(process.env.REACT_APP_BACKEND_BASE + '/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([message])
    }).then(response => {
        // console.log("Response for " + response?.url + " with status: " + response?.status);
    }).catch(error => console.error(error))
}
