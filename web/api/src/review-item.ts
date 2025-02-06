import {BaseRespT, formatUrl, getClient} from "./base";
import {BaseResp, ReviewItemFull} from "./gen/models";

export interface ReviewItemFindReq {
    Url: string;
    SiteBizID?: string;
    Title?: string;
}

export function reviewItemFind(q: ReviewItemFindReq) {
    return getClient().post('/api/review-item/find', q) as Promise<BaseRespT<ReviewItemFull>>
}
