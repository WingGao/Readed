import {buildClient, getClient} from "./base";
import {DefaultApi, DefaultApiFactory, DefaultApiFp} from './gen/api'
import {AxiosInstance} from "axios";
import {merge} from "lodash-es";
import {BaseAPI} from "./gen/base";

export * from "./gen/models";
export * from './base'

export type IApi = {
  getClient: typeof getClient;
  testError: () => Promise<any>;
} & ReturnType<typeof DefaultApiFactory>
const Api: IApi = {
  getClient,
} as any

export function initApi(basePath: string, c: AxiosInstance) {
  buildClient(c)
  merge(Api, DefaultApiFactory(undefined, basePath, c))
  return Api
}

export default Api