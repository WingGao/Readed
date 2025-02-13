import {BaseSiteRule, IInlinePostData, IPostViewData, ISiteMatcher} from "./_base";
import useAppStore, {AppViewPaths, IStore} from "../utils/store";
import $ from 'jquery';
import { TIME_DATE_REGEX } from "../utils/time";

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
  buildPostViewData(): IPostViewData {
    const pid = location.pathname.match(/\/p\/(\d+)/)[1]
    // 获取楼层
    const posts: IInlinePostData[] = []
    $('#j_p_postlist .j_l_post').each((idx,ele)=>{
      const $post = $(ele)
      /**
       * {
    "author": {
        "user_id": 873305203,
        "user_name": "539室长",
        "props": null,
        "portrait": "tb.1.8e4ae5c7.8Ec71BTWrADaWktBYIl4dQ?t=1561591957",
        "user_nickname": "539室长"
    },
    "content": {
        "post_id": 151635997884,
        "is_anonym": false,
        "forum_id": 1532319,
        "thread_id": 9469927012,
        "content": "突然想起我以前看的一部小说名字不知道（那时候很多电子书名字是数字乱码）<br>世界观是科幻+超凡异能，主角是孤儿成年后无意中获得金手指<br>一次主角闯荡上古文明遗迹的时候突然救下了一个女人，那个女人感谢了主角后说她之所以冒险来探索遗迹是因为父亲病了没钱钱想来遗迹搏一把命，主角问她你记得十年前的某一天你在某某孤儿院做了什么吗？那个女人疑惑的摇头，然后主角就没说话了<br>后来主角心里说道，他从小生长在孤儿院很少有社会上的人关心他们孤儿，虽然不至于饿死但也不是什么幸福童年，他记得十年前就是这个女人大概十八岁左右去他在的孤儿院给孤儿送礼物捐物资，那是他第一次看见十几岁的少女来孤儿院献爱心所以记了十年，不过人不能一直靠别人帮助，所以这次救她一命也算报恩了，至于她能不能活下去就跟他没关系了<br><img class=\"BDE_Image\" src=\"http://tiebapic.baidu.com/forum/w%3D580/sign=352ac40e393e6709be0045f70bc69fb8/b294f7fe9925bc31cecc39b118df8db1ca1370e3.jpg?tbpicau=2025-02-22-05_0f6bffd59954e6244bb1873411510810\" size=\"790590\" changedsize=\"true\" width=\"560\" height=\"841\" size=\"790590\">",
        "isPlus": 0,
        "builderId": 873305203,
        "post_no": 1,
        "type": "0",
        "comment_num": 0,
        "is_fold": 0,
        "props": null,
        "post_index": 0,
        "pb_tpoint": null
    }
}
       */
      const rawPostData = $post.data('field')
      if(rawPostData?.content == null) return // 可能是广告
      const postData = {
        id: rawPostData.content.post_id.toString(),
        idx: rawPostData.content.post_no,      
        jq: $post
      } as IInlinePostData
      $post.find('.tail-info').each((idx1,v)=>{
         const date = $(v).text().match(TIME_DATE_REGEX)?.[1]
         if (date) {
          postData.date = new Date(date)
         }
      })
      posts.push(postData)
    })
    // debugger
    return {Site: TieBaSite, Pid: pid, posts}
  },
}

export class TiebaRule extends BaseSiteRule {
}

export {TiebaMatcher}
