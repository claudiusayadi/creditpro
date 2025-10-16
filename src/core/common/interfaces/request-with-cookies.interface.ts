export interface IRequestWithCookies extends Request {
  cookies: Record<string, string>;
}
