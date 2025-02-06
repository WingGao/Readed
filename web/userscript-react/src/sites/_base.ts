const hostMap = new Map<string, ISiteMatcher[]>()


interface ISiteMatcher {
  hosts: string[]

  match(url: URL): boolean
}

export abstract class BaseSiteRule {
  constructor() {
  }
}

export function registerRule(...rules: ISiteMatcher[]){
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
  return hostMap.get(url.hostname).filter(r => r.match(url))
}
