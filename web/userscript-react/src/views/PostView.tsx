import {Button, ConfigProvider, Spin, Switch} from "antd";
import useAppStore from "../utils/store";
import {UserContext} from "../utils";
import {useContext, useRef, useState} from "react";
import {useMount} from "ahooks";
import Api, { Post } from '@wingao/readmark-api'
import { ProDescriptions, ProDescriptionsActionType } from "@ant-design/pro-components";
import { toAntdRep } from "../api";
import { IPostViewData } from "../sites/_base";
import { isElementInViewport } from "../utils/jq";
import dayjs from "dayjs";
import { defaultTo } from "lodash-es";
import {sleep} from "ahooks/lib/utils/testingHelpers";

const POST_VIEW_PATCH_CLASS = 'rm-post-view-patch'
let lastId = ""
function PostView() {
  const actionRef = useRef<ProDescriptionsActionType>();
  const postViewDataRef = useRef<IPostViewData>()
  const {matchedRules} = useContext(UserContext)
  const [post,setPost] = useState<Post | null>(null)
  const [loading,setLoading] = useState(true)
  const {config,setConfig} = useAppStore()

  useMount(async () => {
    let data :IPostViewData
    while(true){
      data = await matchedRules[0].buildPostViewData()
      if(data.posts[0].id != lastId) { //确保没有注册
        break
      }
      await sleep(200)
    }
    lastId=data.posts[0].id
    setLoading(true)
    let rep = (await Api.apiPostSearchPost({Site:data.Site,PidList:[data.Pid]})).data.Data[0]
    // rep.MarkBanned = false
    setPost(defaultTo(rep,{Site: data.Site, Pid: data.Pid}))
    if(config.scriptSimple) data.scriptSimple?.()
    postViewDataRef.current = data
    setLoading(false)
    actionRef.current?.reload()
  })
  const updatePost = async (ext:Partial<Post>)=>{
   await Api.apiPostMarkPost({Site:post!.Site,Pid:post!.Pid,...ext}).then(v=> setPost(v.data.Data))
  }
  return <ConfigProvider theme={{components:{
    Descriptions:{
      itemPaddingBottom: 2
    }
  }}}><ProDescriptions
  actionRef={actionRef}
  loading={loading}
  column={1}
  style={{width:220}}
  request={()=>toAntdRep(post)}
>
  <ProDescriptions.Item label="站内ID">{post?.Pid?`${post?.Pid} (ID:${post?.ID ?? '-'})`:"-"}</ProDescriptions.Item>
  <ProDescriptions.Item dataIndex="UpdatedAt" label="更新时间" valueType="dateTime"  />
  <ProDescriptions.Item label="阅读楼层">{post?.ReadLastReplyIndex?`${post?.ReadLastReplyIndex}楼`:"-"} 
    <Button style={{marginLeft:10}} variant="filled" color="primary" size="small" onClick={async ()=>{
      let lastPost = null
      postViewDataRef.current.posts.forEach(v=>{
        if(isElementInViewport(v.jq)){
          lastPost = v
        }
      })
      if(lastPost){
        await updatePost({ReadLastReplyID:lastPost.id, ReadLastReplyIndex:lastPost.idx, ReadLastReplyTime: lastPost.date.toISOString()})
      }
    }}>更新</Button></ProDescriptions.Item>
  <ProDescriptions.Item label="楼层ID" dataIndex="ReadLastReplyID" />
  <ProDescriptions.Item label="楼层时间" dataIndex="ReadLastReplyTime" valueType="dateTime" />
  <ProDescriptions.Item label="是否屏蔽"><Switch checked={post?.MarkBanned} onChange={async (v)=>{
    await updatePost({MarkBanned:v})
  }} /></ProDescriptions.Item>
  <ProDescriptions.Item label="开启简化"><Switch checked={config.scriptSimple} onChange={async (v)=>{
    setConfig({scriptSimple:v})
  }} /></ProDescriptions.Item>
</ProDescriptions>  </ConfigProvider>
}

export default PostView