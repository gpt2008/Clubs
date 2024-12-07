
import { Form, FormInstance, message } from "antd";
//import FormErrorField from "../utils/form/formErrorField";
import { useTranslation } from "react-i18next";
import FormUtils from "utils/formUtils";
import '../newPassword/NewPassword.scss';
import { Store } from "antd/es/form/interface";
import { Rest } from "utils/utils";
import  FormErrorField  from "utils/form/formErrorField";
import { useState } from "react";
import { useParams } from "react-router-dom";
import router from "router";
import UpdatePassewordForm from "components/updatePasswordForm/UpdatePasswordForm";
import { agendas } from "utils/router-utils";

const ChangePassword = () => {
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
            Rest<{type: string, password: string,currentPassword:string, repeatedPassword: string}, {incorrectCurrentPassword:boolean, incorrectPassword: boolean, incorrectRepeatedPassword: boolean}>().operation({
                type: 'ValidateAltaPassword',
                currentPassword: values.password,
                password: values.newPassword,
                repeatedPassword: values.repeatedPassword,
                //token: "a",
            }).then(result => {
                let errors: FormErrorField[] = [];

                if (result && result.incorrectCurrentPassword) {
                    const passError = {fieldName: 'password', 
                        errorMessage: t('incorrectCurrentPassword')};

                    errors = FormUtils.addError(errors, passError);
                }

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
        Rest<{type: string, newPassword: string}, boolean>().operation({
            type: 'UpdatePassword',
            newPassword: values.newPassword
        }).then(response => {
            if (response) {
                router.navigate(agendas);
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
					<strong>Cambiar contraseña</strong>
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
                            changePassword={true}
                            errorFields={errorFields}
                            setupPassword={setupNewPassword}
                        />
					</div>
				</div>
			</div>
		</div>

    );
}

export default ChangePassword;