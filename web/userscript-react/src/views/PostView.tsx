import {Spin} from "antd";
import useAppStore from "../utils/store";
import {UserContext} from "../utils";
import {useContext} from "react";
import {useMount} from "ahooks";
import Api from '@wingao/readmark-api'

function PostView() {
  const viewData = useAppStore(s => s.postViewData)
  const {matchedRules} = useContext(UserContext)
  useMount(async () => {
    let req = matchedRules[0].buildPostViewData()
    let rep = await Api.apiPostSearchPost(req)

  })
  return <Spin spinning={viewData == null}>PostView</Spin>
}

export default PostView