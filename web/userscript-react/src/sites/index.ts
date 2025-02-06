import {TiebaRule} from './tieba'
import {registerRule} from "./_base";

export {matchRules} from './_base'
// 保证引用
registerRule(TiebaRule)
