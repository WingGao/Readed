import React, {createRef, useEffect, useRef, useState} from 'react';
import ReactDOM, {Root} from 'react-dom/client';
import root from 'react-shadow';
import {StyleProvider,} from '@ant-design/cssinjs';
import App from './App';
import indexCss from './index.css?inline';
import {UserContext} from "./utils";
import {initApi} from "./api";
import {notification} from "antd";
import {useMount, useThrottle, useWhyDidYouUpdate} from "ahooks";
import {matchRules} from './sites'

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
const MyRoot = () => {
    const sheets = [sheet]
    const nodeRoot = useRef(null)
    const [isLoad, setLoad] = useState(false)
    // useEffect(()=> {
    //     if (nodeRoot && nodeRoot.current) {
    //         setLoad(true)
    //     }
    // },[nodeRoot])

    return <React.StrictMode>
        <root.div styleSheets={sheets}>
            <div ref={nodeRoot}>
                {/*{isLoad ? <StyleProvider container={nodeRoot.current}>*/}
                {/*    <App/>*/}
                {/*</StyleProvider> : false}*/}
                {/*    <StyleProvider container={nodeRoot.current}>*/}
                {/*        <App/>*/}
                {/*    </StyleProvider>*/}
            </div>
        </root.div>
    </React.StrictMode>
}

let reactRoot: Root

async function main(newUrl: string = window.location.href) {
    if (reactRoot != null) reactRoot.unmount()
    // @ts-ignore
    window._ReadMarkApi = {reload: main}
    await initApi()
    //check site
    // const manager = registerDefaultRules()
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
        reactRoot.render(<React.StrictMode><MyRawRoot matchedRules={matchedRules}/></React.StrictMode>);
    }
}

window.navigation.addEventListener("navigate", (event) => {
    // main(event.destination.url)
})
main()