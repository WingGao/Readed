// import * as reviewItemApis from './review-item'
import {getClient} from "./base";
import {DefaultApiFactory, DefaultApiFp} from './gen/api'

export * from "./gen/models";
export * from './base'
const Api = {
  getClient,
  testError: () => getClient().get('/404'),
  // ...reviewItemApis,
  ...DefaultApiFactory(null, null, getClient())
}
export default Api