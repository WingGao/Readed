import React, {createRef, useEffect, useRef, useState} from 'react';
import ReactDOM, {Root} from 'react-dom/client';
import root from 'react-shadow';
import {StyleProvider,} from '@ant-design/cssinjs';
import App from './App';
import indexCss from './index.css?inline';
import {UserContext} from "./utils";
import {initApiClient} from "./api";
import {notification} from "antd";
import {useMount, useThrottle, useWhyDidYouUpdate} from "ahooks";
import {matchRules} from './sites'
import useAppStore, { AppViewPaths } from "./utils/store";

const sheet = new CSSStyleSheet();
sheet.replaceSync(indexCss);

const MyRawRoot = (props) => {
    const [notifyApi, contextHolder] = notification.useNotification();
    const shadowRef = useRef(null)
    const appRef = useRef(null)
    const [isLoad, setLoad] = useState(false)
    useMount(() => {
        if (shadowRef && shadowRef.current && !isLoad) {
            setLoad(true)
        }
    })
    window._ReadMarkApi.notifyApi = notifyApi

    useWhyDidYouUpdate('useWhyDidYouUpdateComponent', {...props, isLoad, shadowRef, indexCss});

    return <UserContext.Provider value={{rootNode: shadowRef.current, matchedRules: props.matchedRules}}>
        {contextHolder}
        <div ref={shadowRef}>
            <div>
                <style>{indexCss}</style>
                {isLoad ? <StyleProvider container={shadowRef.current}>
                    <App/>
                </StyleProvider> : false}
            </div>
        </div>
    </UserContext.Provider>
}

let reactRoot: Root

async function main(newUrl: string = window.location.href) {
    if (reactRoot != null) reactRoot.unmount()
    // @ts-ignore
    window._ReadMarkApi = {reload: main}
    await initApiClient()
    //check site
    let matchedRules = matchRules(newUrl)
    console.log('matchedRules', matchedRules)
    if (matchedRules.length > 0) {
        reactRoot = ReactDOM.createRoot(
            (() => {
                const app = document.createElement('div');
                app.attachShadow({
                    mode: 'open',
                })
                document.body.append(app);
                return app.shadowRoot;
            })(),
        )
        if(import.meta.env.DEV) reactRoot.render(<React.StrictMode><MyRawRoot matchedRules={matchedRules}/></React.StrictMode>);
        else reactRoot.render(<MyRawRoot matchedRules={matchedRules}/>);
    }
    matchedRules.forEach(rule => {
        let view = null
        if(rule.matchPostView(new URL(newUrl))) {
            view = AppViewPaths.POST
        } else if(rule.matchPostListView(new URL(newUrl))) {
            view = AppViewPaths.POST_LIST
        }
        if(view != null) useAppStore.setState({route: [view]})
    })
}
// @ts-ignore
window.navigation.addEventListener("navigate", (event) => {
    // main(event.destination.url)
})
main()