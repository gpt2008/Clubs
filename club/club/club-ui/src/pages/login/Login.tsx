import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message } from "antd";
import { Store } from "antd/es/form/interface";
import LoginForm from "components/loginForm/LoginForm";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import router from "router";
import LoginOperation from "types/operations/LoginOperation";
import LoginOperationResponse from "types/operations/LoginOperationResponse";
import { agendas } from "utils/router-utils";
import { Rest } from "utils/utils";
import "./login.scss";

function Login() {
	const { t } = useTranslation(["login"]);

	const [loading, setLoading] = useState<boolean>(false);

	const [messageApi, contextHolder] = message.useMessage();

	const validationFailed = () => {
		setLoading(false);
		messageApi.warning(t("emptyFieldsWarning"));
	};

	const handleForgetPassword = async (values: Store) => {
		var emailAdmin: string = "";
		var responseSelectEmail = null;
		var cleanUsername = values.username.trim();
		responseSelectEmail = await Rest<{ type: string; codeUser: string }, any>().operation({
			type: "SelectEmailAdminByCode",
			codeUser: cleanUsername,
		});
		if (responseSelectEmail != null) {
			emailAdmin = responseSelectEmail["valueEmail"];
		}


		Rest<{ type: string; username: string; email: string }, number>()
			.operation({
				type: "RegeneratePassword",
				username: cleanUsername,
				email: emailAdmin,
			})
			.then((response) => {
				if (response === 0) {
					messageApi.success("Correo de recuperacion de contraseña solicitado con exito");
				}
				if (response === 1) {
					messageApi.error("Se ha producido un error al introducir el usuario");
				}
			});
	};

	const login = (values: Store) => {
		var cleanUsername = values.username.trim();
		setLoading(true);
		Rest<LoginOperation, LoginOperationResponse>()
			.operation({
				type: "Login",
				login: cleanUsername,
				password: values.password,
			})
			.then((response) => {
				setLoading(false);
				if (response.valid) {
					router.navigate(agendas);
				} else {
					messageApi.error(t("invalidCredentials"));
				}
			});
	};

	return (
		<>
			{contextHolder}
			<div className="login__container">
				<div className="login__container__left">
					<h1 className="primary">
						<strong>{t("accessArea")}</strong>
					</h1>
					<p>{t("accessAreaWelcome")}</p>
					<div className="login__container__left__forms">
						<LoginForm
							onFailedForm={validationFailed}
							onSuccess={login}
							loading={loading}
							onForgotPassword={handleForgetPassword}
						/>
					</div>
					<div className="login__info">
						<FontAwesomeIcon icon={faInfo} />
						<p>{t("information")}</p>
					</div>
				</div>
				<div className="login__container__right" />
			</div>
		</>
	);
}

export default Login;
