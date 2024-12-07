import UnderConstruction from "comps/UnderConstruction";
import LandingLayout from "layout/LandingLayout";
import LoginLayout from "layout/LoginLayout";
import MainLayout from "layout/MainLayout";
import AgendasScheduleContainer from "pages/agendas/AgendasScheduleContainer";
import AppointmentsContainer from "pages/appointments/AppointmentsContainer";
import ClientesContainer from "pages/clients/Clientes";
import LocationListContainer from "pages/locations/LocationListContainer";
import NewPassword from "pages/newPassword/NewPassword";
import ServicePortfolioListContainer from "pages/portfolios/ServicePortfolioListContainer";
import ProviderListContainer from "pages/provider/ProviderListContainer";
import QuestionnaireAnswersContainer from "pages/questionnaireAnswers/QuestionnaireAnswersContainer";
import QuestionnaireListContainer from "pages/questionnaires/QuestionnaireListContainer";
import SpecialityListContainer from "pages/specialidades/SpecialityListContainer";
import SubspecialityListContainer from "pages/subspecialidades/SubspecialityListContainer";
import ActsListContainer from "pages/actos/ActsListContainer";
import NomenclatorListContainer from "pages/nomenclator/NomenclatorListContainer";
import CarterasListContainer from "pages/carteras/CarterasListContainer";
import PreciosListContainer from "pages/precios/PreciosListContainer";

import { createBrowserRouter, Navigate } from "react-router-dom";
import {
	agendas,
	app,
	appointments,
	locations,
	login,
	newPassword,
	services,
	specialities,
	staff,
	subspecialities,
	acts,
	nomenclator,
	carteras,
	changePassword,
	pacientes,
	nuevacita
} from "../utils/router-utils";
import ChangePassword from "pages/changePassword/ChangePassword";
import InvoiceListContainer from "pages/invoice/InvoiceListContainer";
import NuevaCitaContainer from "pages/cita/NuevaCitaContainer";

const router = createBrowserRouter([
	{
		path: app,
		element: <MainLayout />,
		children: [
			{
				path: agendas,
				element: <AgendasScheduleContainer />,
			},
			{
				path: pacientes,
				element: <ClientesContainer />,
			},
			{
				path: staff,
				element: <ProviderListContainer />,
			},
			{
				path: locations,
				element: <LocationListContainer />,
			},
			{
				path: services,
				element: <ServicePortfolioListContainer />,
			},
			{
				path: appointments,
				element: <AppointmentsContainer />,
			},
			/*{
				path: questionnaire,
				element: <QuestionnaireListContainer />,
			},
			{
				path: questionnaireAnswers,
				element: <QuestionnaireAnswersContainer />,
			},*/
			{
				path: specialities,
				element: <SpecialityListContainer />,
			},
			{
				path: subspecialities,
				element: <SubspecialityListContainer />,
			},
			{
				path: acts,
				element: <ActsListContainer />,
			},
			{
				path: nomenclator,
				element: <NomenclatorListContainer />,
			},
			{
				path: carteras,
				element: <CarterasListContainer />,
			},
			/*{
				path: precios,
				element: <PreciosListContainer />,
			},
			{
				path: facturas,
				element: <InvoiceListContainer />,
			},*/
			{
				path: nuevacita,
				element: <NuevaCitaContainer/>,
			}
		],
	},
	{
		path: login,
		element: <LoginLayout />,
	},
	{
		element: <LandingLayout />,
		children: [
			{
				path: newPassword,
				element: <NewPassword />,
			},
			{
				path: changePassword,
				element: <ChangePassword />,
			},
		],
	},

	{
		path: "*",
		element: <Navigate to={login} replace />,
	},
]);

export default router;
