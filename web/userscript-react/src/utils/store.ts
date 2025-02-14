import { create } from 'zustand'
import {Post} from "@wingao/readmark-api";
import { GM_getValue, GM_setValue } from '$';
import { merge } from 'lodash-es';

/**
 * 组件路由
 */
export const AppViewPaths = {
  LOGIN: '/login',
  POST: '/post',
  POST_LIST: '/post-list',
}


export type IStore = {
  token: string | null;
  setToken: (token:string)=>void;
  route: string[];
  postViewData: Pick<Post, 'Site'|'Path'|'Pid'>;
  config: IConfig
  setConfig: (config:IConfig)=>void
}

const useAppStore = create<IStore>((set) => ({
  route: [],
  token: GM_getValue('token',null),
  // PostView 专用数据
  postViewData: null,
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
  setToken: (token:string)=>{
    GM_setValue('token',token)
    set({token})
  },
  config: GM_getValue('config',{} as IConfig),
  setConfig: (config:IConfig)=>{
    set(state => {
      const c = merge({},state.config,config)
      GM_setValue('config',c)
      return {config:c}
    })   
  }
}))


export interface IConfig {
  hideBanned?: boolean
}
export default useAppStore