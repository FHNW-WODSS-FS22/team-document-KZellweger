export const fetchSampleName = () => {
  const akabab = 'https://akabab.github.io/starwars-api/api/id/';
  const akababFn = (num) => `${akabab}${num}.json`;

  const num = Math.floor(Math.random() * 66);

  return fetch(akababFn(num))
    .then((response) => response.json())
    .then().catch((error) => console.error(error));
};

export default fetchSampleName;
