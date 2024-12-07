import FormErrorField from './form/formErrorField';
import { Store } from 'antd/lib/form/interface';

export default {

    isError(field: string, errors?: FormErrorField[]) {
        return errors && errors.some(e => e.fieldName === field);
    },

    addError(errorFields: FormErrorField[], newError: FormErrorField) {
        return [...errorFields?.filter(e => e.fieldName !== newError.fieldName)!, newError];
    },

    getErrorMessage(field: string, errors?: FormErrorField[]) {
        return errors && errors.find(e => e.fieldName === field) && errors.find(e => e.fieldName === field)?.errorMessage;
    },

    getEmtpyFields(values: Store) {
        return Object.keys(values).filter(field => !values[field]).map(f => ({fieldName: f}));
    },
}