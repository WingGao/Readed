import { ProForm, ProFormText } from "@ant-design/pro-components"
import Api from "@wingao/readmark-api"
import { Button, Form, Input } from "antd"
import { an } from "react-router/dist/development/route-data-Cq_b5feC"
import { AppViewPaths } from "../utils/store"
import useAppStore from "../utils/store"
import { useNavigate } from "react-router"

function LoginView() {
  return <ProForm submitter={{resetButtonProps:false,searchConfig:{submitText:'登录'}}} 
  onFinish={async (values:any)=>{
    const rep = await Api.apiOpenUserLoginPost(values.Username)
    if(rep.data.Code == 0){
      useAppStore.getState().setToken(rep.data.Data.Token)
      useNavigate(-1)
    }
    return true
  }}>
    <ProFormText label="用户名" name="Username" required />
    <ProFormText label="密码" name="password" />
  </ProForm>
}
export default LoginView
