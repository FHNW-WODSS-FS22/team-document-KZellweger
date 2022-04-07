
export const fetchSampleName = () => {
    const num = Math.floor(Math.random() * 66)
    return fetch('https://swapi.dev/api/people/' + num)
        .then(response => response.json())
        .then().catch(error => console.error(error))
}