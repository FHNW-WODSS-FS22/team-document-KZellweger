const resetDb = () => {
    requestUrl("localhost:8080/api/v1/message", {},"DELETE", 204)
}

const requestUrl = (url, body = {}, method = "GET", expectedResponseCode) => {
    cy.request({
        method: method,
        body: body,
        url: url,
        headers: headers()
    })
        .should((response) => {
            expect(response.status).to.eq(expectedResponseCode)
        })
}

const headers = () => {
    return {
        'Authorization': 'Basic ' + btoa('user:1234'),
        'Content-Type': 'application/json'
    }
}

export {
    resetDb,
    requestUrl
}