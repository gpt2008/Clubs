import React from "react";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Form, Input } from "antd";
import { Store } from "antd/lib/form/interface";

import { useTranslation } from "react-i18next";
import './ForgotPassword.scss'

interface IProps {
    mailSent?: boolean;
    warningPasswordMessage?: string;
    errorPasswordMessage?: string;
    onForgotPassword: (values: Store) => void;
    validationPasswordFailed: () => void;
    closePasswordForm: () => void;
}

const ForgotPassword = (props: IProps) => {
    const { t } = useTranslation('login');

    const[form] = Form.useForm();

    const handleOnfinish = (values: Store) => {
        props.onForgotPassword(values);
        props.closePasswordForm();
    }


    return (
        <>
            {!props.mailSent ? <>
                <h4><strong>{t('regeneratepassword')}</strong></h4>
                <p className='regenerate-password-message'>{t('forgotPasswordSubtitle')}</p>
                <Form form={form} size='large' onFinish={handleOnfinish} onFinishFailed={props.validationPasswordFailed}>
                    <Form.Item name='username'>
                        <Input placeholder={t('username')} required />
                    </Form.Item>
                    {props.warningPasswordMessage && <Alert message={props.warningPasswordMessage} type='warning' showIcon />}
                    {props.errorPasswordMessage && <Alert message={props.errorPasswordMessage} type='error' showIcon />}
                    <Button type='primary' htmlType='submit' size='large' block>{t('newPasswordButton')}</Button>
                    <div className="forgot_cancel_container"><a className="forgot_cancel_container__button"  onClick={props.closePasswordForm}>{t('cancel')}</a></div>
                </Form>
            </>
            : <>
                <p className='regenerate-password-mail-sent'><FontAwesomeIcon icon={faCheckCircle} /></p>
                <p className='regenerate-password-message'>{t('mailSentSubtitle')}</p>
                <Form size='large' style={{marginTop: '1rem'}} onFinish={props.closePasswordForm}>
                    <div className=""><Button type='primary' htmlType='submit' size='large' block>{t('returnLoginButton')}</Button></div>
                </Form>
            </>}
        </>
    );
}

export default ForgotPassword;