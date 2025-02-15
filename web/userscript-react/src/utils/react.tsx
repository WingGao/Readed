import ReactDOM from "react-dom/client"
import $ from "jquery"
import { H } from "react-router/dist/development/route-data-Cq_b5feC"

/**
 * 挂载组件到指定位置
 * @param root 挂载的根元素
 * @param containerHTML 挂载的容器HTML
 * @param key 将容器的id设置为key，判断是否已经挂载
 * @param component 挂载的组件
 * @returns 
 */
export function mountAppend(root:JQuery<HTMLElement>,containerHTML:string,key:string, component:React.ReactNode){
    mountJq(root,containerHTML,key,(c)=> {
        root.append(c)
        return component
    })
}

export function mountPrepend(root:JQuery<HTMLElement>,containerHTML:string,key:string, component:React.ReactNode){
    mountJq(root,containerHTML,key,(c)=> {
        root.prepend(c)
        return component
    })
}
export function mountJq(root:JQuery<HTMLElement>,containerHTML:string,key:string, onMount:(containerJq:JQuery<HTMLElement>)=>React.ReactNode){
    if(root.find(`#${key}`).length > 0) return // 如果已经存在，则不重复挂载
    const containerJq = $(containerHTML)
    containerJq.attr('id',key)
    ReactDOM.createRoot(containerJq[0]).render(onMount(containerJq))
}
