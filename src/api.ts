const url = new URL('https://api.api-ninjas.com/v1/airports');
const params = {
    method: 'GET',
    headers: { "X-Api-Key": process.env.REACT_APP_AIRPORTS_API_KEY ?? "" }
};

export function nameSearch(search: string): Promise<Response> {
    return fetch(`${url}?country=US&name=${search}`, params);
};

export function iataSearch(search: string): Promise<Response> {
    return fetch(`${url}?country=US&iata=${search}`, params);
};