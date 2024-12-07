import React from 'react';
import { Form, Row, Col, Button, AutoComplete} from 'antd';
import { useTranslation } from 'react-i18next';
import { FormInstance } from 'antd/lib/form';

const QuestionnaireListFilters = (props: {
    questionnaireNameFilter?: {value: string}[],
    searchQuestionnaireName: (value: string) => void,
    applyFilters: (form: FormInstance) => void,
    resetFilters: () => void,
}) => {

    const [form] = Form.useForm();

    const { t } = useTranslation(['questionnaireList']);
    
    const resetFilters = () => {
        form.resetFields();
        props.resetFilters();
    }

    return (<>
        <Form size='large' layout='vertical' className='form__smaller-margin' form={form} style={{width: '100%'}}>
            <Form.Item name='questionnaireName' label={t('questionnaireName')}>
                <AutoComplete
                    options={props.questionnaireNameFilter}
                    placeholder={t('placeHolders:enterName')}
                    onSearch={props.searchQuestionnaireName}
                />
            </Form.Item>
        </Form>
        
        <Row gutter={16}>
            <Col span={12}><Button type='primary' block onClick={() => props.applyFilters!(form)}>{t('buttons:apply')}</Button></Col>
            <Col span={12}><Button danger block onClick={resetFilters}>{t('buttons:reset')}</Button></Col>
        </Row>
   </> );
}

export default QuestionnaireListFilters;