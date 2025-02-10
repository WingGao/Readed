import {Spin, Switch} from "antd";
import useAppStore from "../utils/store";
import {UserContext} from "../utils";
import {useContext, useRef, useState} from "react";
import {useMount} from "ahooks";
import Api, { Post } from '@wingao/readmark-api'
import { ProDescriptions, ProDescriptionsActionType } from "@ant-design/pro-components";
import { toAntdRep } from "../api";

function PostView() {
  const actionRef = useRef<ProDescriptionsActionType>();
  const {matchedRules} = useContext(UserContext)
  const [post,setPost] = useState<Post | null>(null)
  const [loading,setLoading] = useState(true)

  useMount(async () => {
    let req = matchedRules[0].buildPostViewData() as any
    req.PidList = [req.Pid]
    setLoading(true)
    let rep = (await Api.apiPostSearchPost(req)).data.Data[0]
    // rep.MarkBanned = false
    setPost(rep)
    setLoading(false)
    actionRef.current?.reload()
  })
  return <ProDescriptions
  actionRef={actionRef}
  title="帖子"
  loading={loading}
  column={1}
  style={{width:220}}
  request={()=>toAntdRep(post)}
>
  <ProDescriptions.Item dataIndex="ID" label="ID" />
  <ProDescriptions.Item dataIndex="UpdatedAt" label="更新时间" valueType="dateTime"  />
  <ProDescriptions.Item label="是否屏蔽"><Switch checked={post?.MarkBanned} onChange={async (v)=>{
    await Api.apiPostMarkPost({Site:post!.Site,Pid:post!.Pid,MarkBanned:v}).then(v=> setPost(v.data.Data))
    actionRef.current?.reload()
  }} /></ProDescriptions.Item>
</ProDescriptions>  
}

export default PostView