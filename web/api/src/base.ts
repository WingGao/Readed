import {AxiosInstance} from "axios";
import qs from 'qs'
import {BaseResp} from "./gen/models";

let client: AxiosInstance

export function buildClient(c: AxiosInstance) {
    client = c
}

export function getClient() {
    if(client == null) throw new Error('client未设置')
    return client
}

export function formatUrl(base: string, q: any) {
    return base + '?' + qs.stringify(q)
}

export interface BaseRespT<T> extends BaseResp {
    Data?: T
}