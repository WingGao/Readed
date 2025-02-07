import { create } from 'zustand'
import {Post} from "@wingao/readmark-api";

/**
 * 组件路由
 */
export const AppViewPaths = {
  LOGIN: '/login',
  POST: '/post',
}


export type IStore = {
  route: string[];
  postViewData: Pick<Post, 'Site'|'Path'|'Pid'>;
}

const useAppStore = create<IStore>((set) => ({
  route: [],
  // PostView 专用数据
  postViewData: null,
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
}))

export default useAppStore