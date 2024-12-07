
import { Button, Col, Form, FormInstance, Input, Row, Space, message } from "antd";
//import FormErrorField from "../utils/form/formErrorField";
import { useTranslation } from "react-i18next";
import FormUtils from "utils/formUtils";
import './NewPassword.scss';
import { Store } from "antd/es/form/interface";
import { Rest } from "utils/utils";
import  FormErrorField  from "utils/form/formErrorField";
import { useState } from "react";
import { useParams } from "react-router-dom";
import router from "router";
import UpdatePassewordForm from "components/updatePasswordForm/UpdatePasswordForm";


interface IProps {
    //setupNewPassword: (form: FormInstance) => void;
    //errorFields: FormErrorField[];
}



const NewPassword = (/*props: IProps*/) => {
    const { t } = useTranslation(['changePassword']);

    const [form] = Form.useForm();
    const [errorFields, setErrorFields] = useState<FormErrorField[]>();

    let { token } = useParams();
    

    const setupNewPassword = (form: FormInstance) => {
        setErrorFields([]);
        formValidation(form);
        
    }

    const formValidation = (form: FormInstance) => {
        form.validateFields().then(values => {
            internalValidation(values, true);
        }).catch(info => {
            internalValidation(info.values, false);
        });
    }

    const internalValidation = (values: Store, formValidationSucceded: boolean) => {
        validatePassword(values).then(errors => {
            if (formValidationSucceded && (!errors || errors.length === 0)) {
                save(values);
            } else {
                setErrorFields(errors);
            }
        });
    }

    const validatePassword = (values: Store) => {
        return new Promise((resolve: (f: FormErrorField[]) => void) => {
            Rest<{type: string, password: string, repeatedPassword: string, token: string}, {incorrectCurrentPassword:boolean, incorrectPassword: boolean, incorrectRepeatedPassword: boolean}>().operation({
                type: 'ValidateAltaPassword',
                password: values.newPassword,
                repeatedPassword: values.repeatedPassword,
                token: (token as string),
            }).then(result => {
                let errors: FormErrorField[] = [];

                if (result && result.incorrectPassword) {
                    const passError = {
                        fieldName: 'newPassword',
                        errorMessage: t('incorrectPasswordSecurity')
                    };

                    errors = FormUtils.addError(errors, passError);
                }

                if (result && result.incorrectRepeatedPassword) {
                    const passError = {
                        fieldName: 'repeatedPassword',
                        errorMessage: t('incorrectPasswordConfirmation')
                    };

                    errors = FormUtils.addError(errors, passError);
                }

                resolve(errors);
            });
        });
    }

    const save = (values: Store) => {
        Rest<{type: string, valueUUID: string, newPassword: string}, boolean>().operation({
            type: 'SetupNewPassword',
            valueUUID: (token as string),
            newPassword: values.newPassword
        }).then(response => {
            if (response) {
                router.navigate('/');
                message.success({
                    style: {cursor: 'pointer'},
                    key: 'changePassword:changePasswordSuccessful',
                    content: t('changePassword:changePasswordSuccessful'),
                    duration: 0,
                    onClick: () => message.destroy('changePassword:changePasswordSuccessful')
                });
            } else {
                router.navigate('/oops');
            }
        });
    }

    return (

        <div className="forget-password-container">
			<div className="content">
				<h3 className="content title">
					<strong>Nueva contraseña</strong>
				</h3>
				<div className="content-inner">
					<div className="welcome-container password-box-container">
						<div className="intro-container">
							<p>{t("newPassword")}</p>
							<ul>
								<li>{t("charactersLength")}</li>
								<li>{t("capitalConditionLabel")}</li>
								<li>{t("numberConditionLabel")}</li>
							</ul>
						</div>
						<UpdatePassewordForm
                            form={form} 
                            errorFields={errorFields}
                            setupPassword={setupNewPassword}
                        />
					</div>
				</div>
			</div>
		</div>

    );
}

export default NewPassword;