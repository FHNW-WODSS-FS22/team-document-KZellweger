export function sendMessage(message) {
    return fetch(process.env.REACT_APP_BACKEND_BASE + '/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    }).then(data => data.json())
}

export function getMessages() {
    return fetch(process.env.REACT_APP_BACKEND_BASE + '/messages')
        .then(data => data.json())
}