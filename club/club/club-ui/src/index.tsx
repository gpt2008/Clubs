import React from "react";
import ReactDOM from "react-dom";
import "./App.scss";
import { customTheme } from "./css/theme";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

import { ConfigProvider } from "antd";
import { I18nextProvider } from "react-i18next";
import locales from "./i18n/antdLocales";
import i18n from "./i18n/i18n";

// Moment locale setting
import dayjs from "dayjs";
import { Outlet, RouterProvider } from "react-router-dom";
import router from "./router";
import "css/fontawesome/css/fontawesome.min.css";
import "css/fontawesome/css/regular.min.css";
import "css/fontawesome/css/solid.min.css";

dayjs.locale(i18n.language);

ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <ConfigProvider
        theme={customTheme}
        locale={locales[i18n.language]}
        form={{ validateMessages: { required: " " } }}
      >
        <RouterProvider router={router} />
        <Outlet />
      </ConfigProvider>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
