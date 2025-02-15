import { useMount } from "ahooks"
import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../utils"
import { IInlinePostData, IPostViewData } from "../sites/_base"
import Api, { Post } from "@wingao/readmark-api"
import { Button, ConfigProvider, Switch, Tag, Tooltip } from "antd"
import { ProDescriptions } from "@ant-design/pro-components"
import { toAntdRep } from "../api"
import useAppStore from "../utils/store"
import { keyBy } from "lodash-es"
import ReactDOM from "react-dom/client"
import { mountAppend, mountPrepend } from "../utils/react"
import dayjs from "dayjs"
import { FMT_NORMAL_DATETIME } from "../utils/time"


const PostWidget = ({site,post}:{site:string,post:IInlinePostData})=>{
    const [banned,setBanned] = useState(false)
    return <><Button size="small" danger onClick={()=>{        
        if(banned){
            post.jq.css('background-color','')
        }else{
            post.jq.css('background-color','gray')            
        }
        setBanned(!banned)
        console.log('postMarkBanned',post.id)
        Api.apiPostMarkPost({Site:site,Pid:post.id,MarkBanned:!banned})
    }}>{banned ? '取消屏蔽' : '屏蔽'}</Button>
    {post.serverData?.ReadLastReplyIndex ? <Tooltip title={<>阅读时间：{dayjs(post.serverData.UpdatedAt).format(FMT_NORMAL_DATETIME)}<br/>
    楼层时间：{dayjs(post.serverData.ReadLastReplyTime).format(FMT_NORMAL_DATETIME)}</>}>
        <Tag color="blue">已阅{post.serverData.ReadLastReplyIndex}</Tag></Tooltip>:null}
    </>
}
/**
 * 挂载帖子小组件
 */
function mountPostWidget(site:string,post:IInlinePostData){
    mountPrepend(post.jqWidgetRoot,`<span class="flag-post-widget"></span>`,post.id,<PostWidget site={site} post={post} />)
}

const PostListView = () => {
    const postViewDataRef = useRef<IPostViewData>()
    const {matchedRules} = useContext(UserContext)
    const [loading,setLoading] = useState(true)
    const {config,setConfig} = useAppStore()

    useMount(async ()=>{
        const data = await matchedRules[0].buildPostListViewData()       
        setLoading(true)
        const req = {Site: data.Site, PidList: data.posts.map(p=>p.id)}
        const rep = (await Api.apiPostSearchPost(req)).data.Data
        const postMap = keyBy(rep,'Pid')
        data.posts.forEach(p=>{
            p.serverData = postMap[p.id]
        })
        postViewDataRef.current = data
        // if(config.scriptSimple) data.scriptSimple?.()
        setLoading(false)
    })
    useEffect(()=>{
        if(postViewDataRef.current == null) return
        postViewDataRef.current.posts.forEach(p=>{
            const serverData = p.serverData
            if(serverData !=null){
                if(serverData.MarkBanned){ // 屏蔽逻辑
                    p.jq.css('background-color','gray')   
                    if(config.hideBanned) p.jq.hide() 
                    else p.jq.show()
                }
            }
            mountPostWidget(postViewDataRef.current.Site, p)
        })
        console.log('config',config)
    },[config,loading])
    return <ConfigProvider theme={{components:{
    Descriptions:{
      itemPaddingBottom: 2
    }
  }}}><ProDescriptions
  loading={loading}
  column={1}
  style={{width:220}}
>
  <ProDescriptions.Item label="隐藏屏蔽"><Switch checked={config.hideBanned} onChange={async (v)=>{
    setConfig({hideBanned:v})
  }} /></ProDescriptions.Item>
</ProDescriptions>  </ConfigProvider>
}

export default PostListView


