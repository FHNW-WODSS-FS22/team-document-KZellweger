
export const fetchSampleName = () => {

    const swappi = "https://swapi.dev/api/people/";
    const akabab = "https://akabab.github.io/starwars-api/api/id/";

    const swappiFn = (num) => {
        return `${swappi}${num}`
    }

    const akababFn = (num) => {
        return `${akabab}${num}.json`
    }

    const num = Math.floor(Math.random() * 66)

    return fetch(akababFn(num))
        .then(response => response.json())
        .then().catch(error => console.error(error))
}