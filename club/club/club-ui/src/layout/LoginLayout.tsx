import { Layout } from "antd";
import "css/layout.scss";
import DenticardLogo from "images/dentycard-logo.png";
import DenticardIsotipo from "images/isotipo.png";
import LoginContainer from "pages/login/LoginContainer";
const { Header, Content } = Layout;

function LoginLayout() {
	return (
		<Layout style={{ minHeight: "100%", overflow: "hidden" }}>
			<Header className="login__header">
				<img className="login__header--isotipo" src={DenticardIsotipo} alt="Isotipo" />
				<img className="login__header--logotipo" src={DenticardLogo} alt="Logotipo" />
			</Header>
			<Content className="login__content">
				<div className="login__content__container">
					<LoginContainer />
				</div>
			</Content>
		</Layout>
	);
}

export default LoginLayout;
