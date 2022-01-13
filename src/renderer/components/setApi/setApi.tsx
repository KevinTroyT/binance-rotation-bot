import { Form, Input, Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import ipcRenderer from 'renderer/utils/utils';

const SetApi = (props: any) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [apiKey, setApiKey] = useState();
  const [apiSecret, setApiSecret] = useState();
  useEffect(() => {
    if (!apiKey && !apiSecret) {
      ipcRenderer.getApi();
    }
    ipcRenderer.on('getApi', (arg: any) => {
      setApiKey(arg[0]);
      setApiSecret(arg[1]);
      setVisible(false);
      setConfirmLoading(false);
    });
    return () => {};
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      apiKey,
      apiSecret,
    });
  }, [apiKey, apiSecret]);
  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    ipcRenderer.setApi(
      form.getFieldValue('apiKey'),
      form.getFieldValue('apiSecret')
    );
    ipcRenderer.getApi();
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Form
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 15 }}
      initialValues={{ apiKey, apiSecret }}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
      style={props.style}
    >
      <Form.Item
        label="ApiKey"
        name="apiKey"
        rules={[{ message: 'Please input your Apikey!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="ApiSecret"
        name="apiSecret"
        rules={[{ message: 'Please input your ApiSecret!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }}>
        <Button type="primary" onClick={showModal}>
          修改
        </Button>
        <Modal
          title="修改APIKEY"
          visible={visible}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          确定修改APIkey和APISecret？ 建议不要修改
        </Modal>
      </Form.Item>
    </Form>
  );
};
export default SetApi;
