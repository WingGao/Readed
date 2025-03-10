import {Post} from "@wingao/readmark-api";
import {IStore} from "../utils/store";

const hostMap = new Map<string, ISiteMatcher[]>()


export interface ISiteMatcher {
  hosts: string[]

  /**
   * 判断是否匹配帖子详情
   * @param url
   */
  matchPostView(url: URL): boolean

  /**
   * 判断是否匹配帖子列表
   * @param url
   */
  matchPostListView(url: URL): boolean

  buildPostViewData(): Promise<IPostViewData>

  buildPostListViewData(): Promise<IPostListViewData>
}

/**
 * 楼层数据
 */
export interface IInlinePostData {
  id: string
  idx: number
  date: Date
  jq: JQuery<HTMLElement>
  /**
   * 挂载小组件的根元素,一般在帖子标题后面
   */
  jqWidgetRoot?: JQuery<HTMLElement>
  serverData?: Post
}

export type IPostViewData = IStore['postViewData'] & {
  posts: IInlinePostData[]
  // 简化页面
  scriptSimple?: () => void
}

export type IPostListViewData = IStore['postViewData'] & {
  posts: IInlinePostData[]

}

export abstract class BaseSiteRule {
  constructor() {
  }
}

export function registerRule(...rules: ISiteMatcher[]) {
  for (const rule of rules) {
    for (const host of rule.hosts) {
      const rules = hostMap.get(host)
      if (rules) {
        rules.push(rule)
      } else {
        hostMap.set(host, [rule])
      }
    }
  }
}

export function matchRules(urlStr: string) {
  const url = new URL(urlStr)
  return hostMap.get(url.hostname).filter(r => r.matchPostView(url) || r.matchPostListView(url))
}
