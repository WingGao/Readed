import {BaseSiteRule, ISiteMatcher} from "./_base";
import useAppStore, {AppViewPaths, IStore} from "../utils/store";


const TieBaSite = 'tieba.baidu.com'

const TiebaMatcher: ISiteMatcher = {
  hosts: [TieBaSite],
  match(url: URL): boolean {
    if (url.pathname.indexOf("/p/") >= 0) return true
    return false;
  },
  mount() {
    if (location.pathname.indexOf('/p/') >= 0) {
      return AppViewPaths.POST
    }
  },
  buildPostViewData(): IStore["postViewData"] {
    const pid = location.pathname.match(/\/p\/(\d+)/)[1]
    return {Site: TieBaSite, Pid: parseInt(pid)}
  },
}

export class TiebaRule extends BaseSiteRule {
}

export {TiebaMatcher}
