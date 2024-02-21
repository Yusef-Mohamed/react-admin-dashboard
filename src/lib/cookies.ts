import Cookies, { CookieSetOptions } from "universal-cookie";

const cookies = new Cookies();

export const setCookie = (
  name: string,
  value: string,
  options?: CookieSetOptions
) => {
  cookies.set(name, value, {
    path: "/",
    ...options,
  });
};
export const getCookie = <T = string | undefined>(name: string): T => {
  return cookies.get(name) as T;
};

export const removeCookie = (name: string): void => {
  cookies.remove(name, { path: "/" });
};
