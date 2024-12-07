import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import router from "router";
import items, { submenuKeys } from "./VerticalMenuItems";

const VerticalMenu = () => {
	const [openKeys, setOpenKeys] = useState([router.state.location.pathname]);

	const onOpenChange = (keys: any) => {
		const latestOpenKey = keys.find((key: any) => {
			return openKeys.indexOf(key) === -1;
		});
		if (latestOpenKey && submenuKeys.indexOf(latestOpenKey) === -1) {
			setOpenKeys(keys);
		} else {
			setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
		}
	};

	return (
		<Sider className="app__menu" theme="light" width={250} breakpoint="md" collapsedWidth={50}>
			<Menu
				theme="light"
				mode="inline"
				items={items}
				style={{
					height: "100%",
					borderRight: 0,
				}}
				defaultSelectedKeys={openKeys}
				onSelect={(info) => {
					router.navigate(info.key);
				}}
				openKeys={openKeys}
				onOpenChange={onOpenChange}></Menu>
		</Sider>
	);
};

export default VerticalMenu;
