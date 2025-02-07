import {createContext} from "react";
import {ISiteMatcher} from "../sites/_base";

// @ts-ignore
export const UserContext = createContext<{
    rootNode: HTMLElement,
    matchedRules: ISiteMatcher[]
}>(null);
UserContext.displayName = 'UserContext';