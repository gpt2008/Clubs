import { ThemeConfig, theme } from "antd";

export const color_primary = "rgb(0, 82, 146)"; //"rgb(243, 217, 115)";
export const color_primary_alt = "rgb(0, 82, 146)";
export const color_error = "rgb(149, 48, 51)";
export const color_neutral = "rgb(100, 100, 100)";

export const customTheme: ThemeConfig = {
	token: {
		fontFamily: "'MyriadWebPro', sans-serif",
		colorPrimary: color_primary,
		//colorError: color_error,
		colorErrorBg: "transparent",
		borderRadius: 6,
	},
	components: {
		Progress: {
			defaultColor: color_primary,
		},
		Button: {
			colorBgContainerDisabled: "rgb(207, 204, 192)",
			colorTextDisabled: "rgb(100, 100, 100)",
			primaryShadow: "none",
		},
		Input: {
			colorBgContainerDisabled: "rgb(256, 256, 256)",
			colorTextDisabled: "rgb(169, 169, 169)",
		},
		Select: {
			colorBgContainerDisabled: "rgb(207, 204, 192)",
			colorTextDisabled: "rgb(100, 100, 100)",
		},
		Steps: {
			colorPrimary: color_primary_alt,
		},
	},
};

export const { useToken } = theme;
