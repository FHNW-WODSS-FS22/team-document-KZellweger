export function sendMessage(message) {
    return fetch(process.env.REACT_APP_BACKEND_BASE + '/document', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([message])
    }).then(data => data.json())
}