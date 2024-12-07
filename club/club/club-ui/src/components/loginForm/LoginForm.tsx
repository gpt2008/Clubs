import { faLockOpen, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Input } from "antd";
import { Store } from "antd/es/form/interface";
import ForgotPassword from "comps/forgotPassword/ForgotPassword";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./LoginForm.scss";

interface IProps {
	onSuccess: (arg0: Store) => void;
	onForgotPassword: (values: Store) => void;
	onFailedForm: () => void;
	loading: boolean;
}

function LoginForm(props: IProps) {
	const { t } = useTranslation(["login"]);

	const passwordHandleState = {
		forgotPasswordVisible: false,
		warningPasswordMessage: "",
		errorPasswordMessage: "",
		mailSent: false,
	};

	const [passwordState, setPasswordState] = useState(passwordHandleState);

	const validationPasswordFailed = () => {
		setPasswordState((prevState) => ({
			...prevState,
			warningPasswordMessage: "empty",
		}));
	};

	const onClickForgotPassword = () => {
		setPasswordState((prevState) => ({
			...prevState,
			forgotPasswordVisible: true,
			warningPasswordMessage: "",
			errorPasswordMessage: "",
			mailSent: false,
		}));
	};

	const closePasswordForm = () => {
		setPasswordState((prevState) => ({
			...prevState,
			forgotPasswordVisible: false,
			warningPasswordMessage: "",
			errorPasswordMessage: "",
			mailSent: false,
		}));
	};

	return (
		<>
			<div className="login__form">
				{!passwordState.forgotPasswordVisible ? (
					<>
						<h4 className="login__form__userAccess">
							<strong>{t("userAccess")}</strong>
						</h4>
						<Form
							onFinish={props.onSuccess}
							onFinishFailed={props.onFailedForm}
							autoComplete="off"
							size="middle">
							<Form.Item
								name="username"
								rules={[
									{
										required: true,
									},
								]}>
								<Input placeholder={t("username")} prefix={<FontAwesomeIcon icon={faUser} />} />
							</Form.Item>
							<Form.Item
								name="password"
								rules={[
									{
										required: true,
									},
								]}>
								<Input.Password
									placeholder={t("password")}
									prefix={<FontAwesomeIcon icon={faLockOpen} />}
								/>
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit" block loading={props.loading}>
									{t("login")}
								</Button>
							</Form.Item>
						</Form>
						<div className="container_forgotPass">
							<a className="container_forgotPass__link" onClick={onClickForgotPassword}>
								{t("forgotPassword")}
							</a>
						</div>
					</>
				) : (
					<ForgotPassword
						mailSent={passwordState.mailSent}
						warningPasswordMessage={passwordState.warningPasswordMessage}
						errorPasswordMessage={passwordState.errorPasswordMessage}
						onForgotPassword={props.onForgotPassword}
						validationPasswordFailed={validationPasswordFailed}
						closePasswordForm={closePasswordForm}
					/>
				)}
			</div>
		</>
	);
}

export default LoginForm;
