import React, {useContext, useEffect, useRef, useState} from 'react';
import root from 'react-shadow';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import './App.css';
import {Button, Card, Col, ConfigProvider, Divider, Form, Input, notification, Rate, Row, Select, Space, Spin} from "antd";
import Draggable from 'react-draggable';
import {UserContext} from "./utils";
import {PlusOutlined, SyncOutlined} from "@ant-design/icons";
import Api, {ReviewItemFull} from "@wingao/readmark-api";
import {useAsyncEffect, useMount} from "ahooks";
import {merge} from "lodash-es";

type CurrentView = 'finding' | 'notFound' | 'noSite' | 'edit'

function App() {
    const {matchedRules} = useContext(UserContext)
    const [notify] = notification.useNotification();
    const appRef = useRef<any>(null)
    const [siteId, setSiteId] = useState(0);
    const [step, setStep] = useState('finding' as CurrentView);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [siteForm] = Form.useForm();
    useAsyncEffect(async () => {
        let [matched] = await Promise.all([Api.apiReviewItemFindPost(matchedRules[0]), refreshTypes()])
        console.log(matched)
        setSiteId(matched.data.Data?.site?.ID)
        if (matched.data.Data == null || matched.data.Data.site == null) {
            setStep('noSite')
            siteForm.setFieldsValue({
                Name: matchedRules[0].siteName,
                Host: matchedRules[0].siteHost,
            })
        } else if (matched.data.Data.id == null) {
            setStep('notFound')
        } else {
            setStep('edit')
        }
    }, [])
    const refreshTypes = async () => {
        let rep = await Api.apiReviewItemTypeListGet()
        setTypes(rep.data.Data.map(v => ({label: v.Name, value: v.Key})))
    }
    const onCreate = () => {
        setStep('edit')
        let localMatched = matchedRules[0]
        form.setFieldsValue(merge({
            score: localMatched.mySiteScore,
            site: {
                Name: localMatched.siteName,
                Host: localMatched.siteHost,
            }
        } as ReviewItemFull , localMatched))
    }
    const onSave = async (values) => {
        setLoading(true)
        let data = merge({site_id: siteId, url_path: matchedRules[0].url_path}, values)
        console.log('onSave', data)
        let rep = await Api.apiReviewItemSavePost(data)
        console.log(rep.data)
        setLoading(false)
    }
    const addType = async (name) => {

    }

    const onCreateSite = async (values) => {
        setLoading(true)
        let rep = (await Api.apiReviewItemSiteSavePost(values)).data
        if (rep.Code == 0) {
            setSiteId(rep.Data.ID)
            window._ReadMarkApi.notifyApi.success({message: `Create Site ${values.Name} Success`})
            setStep('notFound')
        }
        setLoading(false)
    }
    const renderCreateSite = () => {
        return <Form form={siteForm} size={"middle"} onFinish={onCreateSite}
                     name="basic"
                     labelCol={{span: 8}}
                     wrapperCol={{span: 16}}
                     style={{maxWidth: 600}}
                     autoComplete="off"
        >
            <Form.Item label="SiteName" name="Name" rules={[{required: true}]}><Input/></Form.Item>
            <Form.Item label="SiteHost" name="Host" rules={[{required: true}]}><Input/></Form.Item>

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    CreateSite
                </Button>
            </Form.Item>
        </Form>
    }

    return (
        <Draggable handle=".drag-title">
            <Card id="app-shadow" className="App" ref={appRef} title={<span className="drag-title">ReadMark</span>}
                  extra={<Button type="text" icon={<SyncOutlined/>} title="reload"
                                 onClick={() => window._ReadMarkApi.reload()}></Button>}>
                {step === 'finding' && <Spin/>}
                {step === 'notFound' && <Button onClick={onCreate}>Create</Button>}
                <ConfigProvider theme={{components: {Form: {itemMarginBottom: 10}}}}>
                    {step === 'edit' && <Form form={form} size={"middle"} onFinish={onSave}
                                              name="basic"
                                              labelCol={{span: 8}}
                                              wrapperCol={{span: 16}}
                                              style={{maxWidth: 600}}
                                              autoComplete="off"
                    >
                        <Form.Item<ReviewItemFull> label="ID" name="id" hidden></Form.Item>
                        <Form.Item<ReviewItemFull> label="SiteBizID" name="site_biz_id" rules={[{required: true}]}><Input/></Form.Item>
                        <Form.Item<ReviewItemFull> label="Title" name="title" rules={[{required: true}]}><Input/></Form.Item>
                        <Form.Item<ReviewItemFull> label="Author" name="author"><Input/></Form.Item>
                        <Form.Item label="Type" required>
                            <Space.Compact block>
                                <Form.Item<ReviewItemFull> name="type_key" noStyle>
                                    <Select showSearch options={types} getPopupContainer={() => appRef.current}/>
                                </Form.Item>
                                <Button icon={<PlusOutlined/>} title="new type"></Button>
                            </Space.Compact>

                        </Form.Item>
                        <Form.Item<ReviewItemFull> label="Score" name="score" rules={[{required: true}]}><Rate/></Form.Item>
                        <Form.Item<ReviewItemFull> label="Review" name="review"><Input.TextArea/></Form.Item>

                        <Form.Item wrapperCol={{offset: 6, span: 16}}>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Save
                            </Button>
                        </Form.Item>
                    </Form>}
                    {step === 'noSite' && renderCreateSite()}
                </ConfigProvider>
            </Card>
        </Draggable>
    );
}

export default App;
