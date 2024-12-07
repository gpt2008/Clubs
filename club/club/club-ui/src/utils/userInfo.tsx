class UserInfo {

    cookieName = 'userInfo';

    public isPresent(): boolean {
        return !!getCookie(this.cookieName);
    }

    public getUserName(): string {

        const cookieContent = getCookie(this.cookieName);
        const userInfoData = getCookieContent(cookieContent);

        return userInfoData ? userInfoData[0] : '';
    }
}

function getCookieContent(cookieValue?: string) {
    let result = cookieValue;
    if (!result) {
        return undefined;
    }
    result = decodeURIComponent(result);
    if (!result) {
        return undefined;
    }
    result = JSON.parse(result);
    return result;
}

function getCookie(cname: string) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let i = 0, length = ca.length; i < length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return undefined;
}

export interface IAvatarInfo { aseguradoCode?: number; existsAvatar: boolean; initials: string; refreshToken: number; }

export default new UserInfo();
