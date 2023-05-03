
export class Cookie {

    getCookie = (name: any) => {
        const cookieName = name + '=';

        const decodedCookie = decodeURIComponent(document.cookie);

        const cookie: string[] = decodedCookie.split(';');

        for (var i = 0; i < cookie.length; i++) {

            while (cookie[i].charAt(0) === ' ') {
                cookie[i] = cookie[i].substring(1);
            }
            if (cookie[i].indexOf(cookieName) === 0) {
                return cookie[i].substring(cookieName.length, cookie[i].length);
            }

        }
        return '';
    }

    setCookie = (name: any, value: any, expire: any) => {

        const date = new Date();
        date.setTime(date.getTime() + (expire * 24 * 60 * 60 * 1000));

        const expires = 'expires=' + date.toUTCString();
        document.cookie = name + '=' + value + ';' + expires + ';path=/';

    }

    deleteCookie = () => document.cookie = 'game=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';


    
}