interface ISetCookieProps {
    name: string;
    value: string;
    days: number;
}

export function setCookie({name, value, days}: ISetCookieProps) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}