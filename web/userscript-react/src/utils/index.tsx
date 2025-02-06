import {createContext} from "react";
import {ISiteMatchResult} from "@wingao/review-vault-siterules/src";

// @ts-ignore
export const UserContext = createContext<{
    rootNode: HTMLElement,
    matchedRules: ISiteMatchResult[]
}>(null);
UserContext.displayName = 'UserContext';