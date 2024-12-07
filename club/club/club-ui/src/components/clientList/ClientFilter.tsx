import React from 'react';
import { Form, Row, Col, Button, AutoComplete } from 'antd';
import { useTranslation } from 'react-i18next';
import { FormInstance } from 'antd/lib/form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ClientFilter = (props: {
    patientNameFilter?: {value: string}[],
    phoneNumberFilter?: {value: string}[],
    searchNamePerson: (value: string) => void
    searchPhone: (value: string) => void
    applyFilters: (form: FormInstance) => void,
    resetFilters: () => void,
}) => {

    const [form] = Form.useForm();

    const { t } = useTranslation('clientList');

    const resetFilters = () => {
        form.resetFields();
        props.resetFilters();
    }

    return (<>
        <Form size='large' layout='vertical' className='form__smaller-margin' form={form} style={{width: '100%'}}>
            <Form.Item name='namePerson' label={t('clientName')}>
                <AutoComplete
                    options={props.patientNameFilter}
                    placeholder={t('filterNamePlaceholder')}
                    onSearch={props.searchNamePerson}
                />
            </Form.Item>
            <Form.Item name='valuePhone' label={t('phone')}>
                <AutoComplete
                        options={props.phoneNumberFilter}
                        placeholder={t('filterPhonePlaceholder')}
                        onSearch={props.searchPhone}
                    />
            </Form.Item>
        </Form>
        <Row gutter={16}>
            <Col span={12}><Button type='primary' block onClick={() => props.applyFilters!(form)}>{t('apply')}</Button></Col>
            <Col span={12}><Button danger block onClick={resetFilters}>{t('reset')}</Button></Col>
        </Row>
   </> );
}

export default ClientFilter;