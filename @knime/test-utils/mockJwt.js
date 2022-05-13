import btoa from 'btoa';

const webSafeBtoa = x => btoa(x).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

const makeJwt = (claims, exp) => {
    let payload = webSafeBtoa(JSON.stringify({ ...claims, exp, jti: String(Math.random()) }));
    return `dummy.${payload}.dummy`;
};

// eslint-disable-next-line no-magic-numbers
export const mockValidJwt = (claims) => makeJwt(claims, Math.ceil(Date.now() / 1000) + 100000);
export const mockExpiredJwt = (claims) => makeJwt(claims, Math.floor(Date.now() / 1000) - 1);
