// Base Paths
export const root = process.env.PUBLIC_URL;
export const app = root + "/app";

// Login Paths
export const login = root + "/login";

// Citas Paths
export const agendas = app + "/citas/agendas"
export const clientes = app + "/citas/clientes"
export const nuevacita = app + "/citas/nueva"
export const appointments = app + "/citas/appointments"
export const newPassword = root + "/newPassword/:token";
export const changePassword = root + "/changePassword";
export const pacientes = app + "/citas/pacientes"

// Agenda Configuration Paths
export const staff = app + "/agenda-configuration/staff"
export const locations = app + "/agenda-configuration/locations"
export const services = app + "/agenda-configuration/services"
//export const questionnaire = app + "/agenda-configuration/questionnaire-list"
//export const questionnaireAnswers = app + "/agenda-configuration/questionnaire-answers"

// Administration Paths
export const specialities = app + "/administration/specialities"
export const subspecialities = app + "/administration/subspecialities"
export const acts = app + "/administration/acts"
export const nomenclator = app + "/administration/nomenclator"
export const carteras = app + "/administration/carteras"
//export const precios = app + "/administration/precios"
//export const facturas = app + "/administration/facturas"

// Questionary paths

// Error Path
export const error = root + "/error";