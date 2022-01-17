import { Form, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import ipcRenderer from 'renderer/utils/utils';

const NotificationSetting = (props: any) => {
  const [form] = Form.useForm();
  const [url, setURL] = useState();
  useEffect(() => {
    if (!url) {
      ipcRenderer.getUrl();
    }
    ipcRenderer.on('getUrl', (arg: any) => {
      setURL(arg);
    });
    return () => {};
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      url,
    });
  }, [url]);
  const handleOk = () => {
    ipcRenderer.setUrl(form.getFieldValue('url'));
    ipcRenderer.getUrl();
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Form
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 15 }}
      initialValues={{ url }}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
      // eslint-disable-next-line react/destructuring-assignment
      style={props.style}
    >
      <Form.Item
        label="webhook"
        name="url"
        rules={[{ message: 'Please input your webhook url!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }}>
        <Button type="primary" onClick={handleOk}>
          修改
        </Button>
      </Form.Item>
    </Form>
  );
};
export default NotificationSetting;
