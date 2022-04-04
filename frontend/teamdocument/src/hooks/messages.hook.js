export function sendMessage(message) {
    return fetch(process.env.REACT_APP_BACKEND_BASE + '/message/GENERIC', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([message])
    }).then(response => console.log("Response for " + response.url + " with status: " + response.status)).then(error => console.error(error))
}
