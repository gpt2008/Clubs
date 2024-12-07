import { Layout } from "antd";
import "css/layout.scss";
import DenticardLogo from "images/dentycard-logo.png";
import DenticardIsotipo from "images/isotipo.png";
import { Outlet } from "react-router-dom";
const { Header, Content } = Layout;

function LandingLayout() {
	return (
		<Layout style={{ minHeight: "100%", overflow: "hidden" }}>
			<Header className="header-app">
				<img className="login__header--isotipo" src={DenticardIsotipo} alt="Isotipo" />
				<img className="login__header--logotipo" src={DenticardLogo} alt="Logotipo" />
			</Header>
			<Content className="main__content">
				<div className="main__content__container">
					<Outlet />
				</div>
			</Content>
		</Layout>
	);
}

export default LandingLayout;
