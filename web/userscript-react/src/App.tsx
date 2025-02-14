import React, {useContext, useEffect, useRef, useState} from 'react';
import {MemoryRouter, Route, Routes, useNavigate} from "react-router";
import './App.css';
import {Button, Card, Col, ConfigProvider, Divider, Form, Input, notification, Rate, Row, Select, Space, Spin} from "antd";
import Draggable from 'react-draggable';
import {PlusOutlined, SyncOutlined} from "@ant-design/icons";
import PostView from "./views/PostView";
import useAppStore, {AppViewPaths} from "./utils/store";
import LoginView from "./views/LoginView";
import { head } from 'lodash-es';
import PostListView from './views/PostListView';


function RouterApp(){
  const route = useAppStore(s=>s.route)
  const navigate = useNavigate()
  useEffect(()=>{
    navigate(route[0])
  },[route])
  return <Routes>
  <Route path={AppViewPaths.LOGIN} element={<LoginView />} />
  <Route path={AppViewPaths.POST} element={<PostView />} />
  <Route path={AppViewPaths.POST_LIST} element={<PostListView />} />
</Routes>
}
function App() {
  const appRef = useRef<any>(null)

  return (
    <Draggable handle=".drag-title">
          <Card id="app-shadow" className="App" ref={appRef} title={<span className="drag-title">ReadMark</span>} 
          styles={{header:{padding:'0 5px'},body:{padding:'5px'},}}
                extra={<Button type="text" icon={<SyncOutlined/>} title="reload"
                               onClick={() => window._ReadMarkApi.reload()}></Button>}>
            <MemoryRouter>
              <RouterApp />
            </MemoryRouter>
          </Card>
    </Draggable>
  );
}

export default App;
