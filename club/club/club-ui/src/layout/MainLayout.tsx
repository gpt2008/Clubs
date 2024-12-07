import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "layout/AppHeaderContainer";
import VerticalMenu from "layout/verticalSider/VerticalMenu";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { OrganizationResume } from "types/entities/Organization";
import { Rest } from "utils/utils";

export interface HomeInfo {
	namePerson: string;
	surnamePerson1: string;
	surnamePerson2: string;
	idOrganization: number;
	hasOrganizationLogo: boolean;
	typeAccess: number;
	ogResume: OrganizationResume;
	patientReservationUrl: string;
}

interface State {
	homeInfo?: HomeInfo;
	page: number;
	collapsed: boolean;
}

class App extends React.Component<WithTranslation, State> {
	public state: State = {
		page: 0,
		collapsed: false,
	};

	private t = this.props.t;

	public componentDidMount() {
		this.loadData();
	}

	/*private getPage = (page: number) => {
    switch (page) {
      case enumPages.HOME_PAGE:
        if (this.state.homeInfo) {
          return (
            <HomeContainer
              organizationResume={this.state.homeInfo.ogResume}
              patientReservationUrl={this.state.homeInfo.patientReservationUrl}
              onPageClicked={this.onPageClicked}
            />
          );
        }
        break;

      case enumPages.STAFF_PAGE:
        return <ProviderListContainer />;

      case enumPages.LOCATIONS_PAGE:
        return <LocationListContainer />;

      case enumPages.SERVICES_PAGE:
        return <ServicePortfolioListContainer />;

      case enumPages.AGENDAS_PAGE:
        return <AgendasScheduleContainer />;

      case enumPages.CLIENTS_PAGE:
        return <ClientListContainer />;

      case enumPages.PDF_CARDS_PAGE:
        return <PdfCardContainer />;

      case enumPages.CARD_CREATOR:
        return <CardCreatorContainer />;

      default:
        return <UnderConstruction />;
    }
  };*/

	public render() {
		return (
			<>
				<Layout style={{ height: "100%", overflow: "hidden" }}>
					<Layout.Header className="header-app">
						<AppHeader homeInfo={this.state.homeInfo} />
					</Layout.Header>
					<div className="container-app">
						<Layout className="container-app--inner" hasSider>
							<VerticalMenu></VerticalMenu>
							<Content style={{ overflowY: "auto" }}>
								<Outlet />
							</Content>
						</Layout>
					</div>
				</Layout>
			</>
		);
	}

	private setCollapsed = (value: boolean) => {
		this.setState({
			...this.state,
			collapsed: value,
		});
	};

	private loadData = () => {
		Rest<{ type: string }, any>()
			.operation({ type: "GetHomeInfo" })
			.then((response) => {
				this.setState({ homeInfo: response });
			});
	};

	private onPageClicked = (key: number) => {
		this.setState({ page: key });
	};

	private onPageBackHome = () => {
		this.setState({ page: 0 });
	};
}

export default withTranslation(["access"])(App);
