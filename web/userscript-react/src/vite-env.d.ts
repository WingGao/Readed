/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
//// <reference types="vite-plugin-monkey/global" />
import {NotificationInstance} from "antd";

declare global {
    interface Window {
        _ReadMarkApi: {
            notifyApi: NotificationInstance,
            reload: ()=> void,
        };
    }
}