import { useMount } from "ahooks"
import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../utils"
import { IPostViewData } from "../sites/_base"
import Api, { Post } from "@wingao/readmark-api"
import { ConfigProvider, Switch } from "antd"
import { ProDescriptions } from "@ant-design/pro-components"
import { toAntdRep } from "../api"
import useAppStore from "../utils/store"
import { keyBy } from "lodash-es"
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
        setLoading(false)
    })
    useEffect(()=>{
        if(postViewDataRef.current == null) return
        postViewDataRef.current.posts.forEach(p=>{
            const serverData = p.serverData
            if(serverData !=null){
                if(serverData.MarkBanned){
                    p.jq.css('background-color','gray')   
                    if(config.hideBanned) p.jq.hide() 
                    else p.jq.show()
                }
            }
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


