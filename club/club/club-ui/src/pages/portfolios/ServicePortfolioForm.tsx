import React from "react";

import { IState as IStateContainer } from './ServicePortfolioFormContainer';
import { Form, FormInstance, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import TextArea from "antd/lib/input/TextArea";

interface IProps {
    visible?: boolean;
    namePortfolio?: string;
    onCancel: () => void;
    onSubmit: (form: FormInstance) => void;
}

const ServicePortfolioForm = (props: IProps & IStateContainer) => {

    const { t } = useTranslation(['portfolioForm']);

    const [form] = Form.useForm();

    const initialValues = {...props.portfolio}

    return (
        (<Modal
            title={props.namePortfolio ? t('editPortfolioTitle', {namePortfolio: props.namePortfolio}) : t('newPortfolioTitle')}
            open={props.visible || false}
            onCancel={props.onCancel}
            cancelText={t('buttons:cancel')}
            onOk={() => props.onSubmit(form)}
            okText={t('buttons:save')}
            destroyOnClose
            width={600}
        >
            <Form layout='vertical' form={form} size='large' initialValues={initialValues}>
                <Form.Item label={t('nameLabel')} name='namePortfolio' rules={[{ required: true }]}>
                    <Input maxLength={256}/>
                </Form.Item>
                <Form.Item label={t('descLabel')} name='descPortfolio' rules={[{ required: true }]}>
                    <TextArea rows={5} style={{resize: 'none'}}/>
                </Form.Item>
            </Form>
        </Modal>)
    );
}

export default ServicePortfolioForm;