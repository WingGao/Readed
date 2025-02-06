import {BaseSiteRule} from "./_base";

export class TiebaRule extends BaseSiteRule {
  static hosts= ['tieba.baidu.com']
  static match(url: URL): boolean {
    if(url.pathname.indexOf("/p/")>=0) return true
    return false;
  }
}
