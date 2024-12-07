import { useEffect, useState } from "react";
import "./ProviderIcon.scss";

type Props = {
	size?: "small" | "default" | "large";
};

function ProviderIcon(props: Props) {
	const [containerPx, setContainerPx] = useState(64);
	const [iconPx, setIconPx] = useState(40);

	useEffect(() => {
		switch (props.size) {
			case "small":
                setContainerPx(48);
				setIconPx(32);
				break;
			case "large":
                setContainerPx(128);
				setIconPx(72);
				break;
			default:
                setContainerPx(64);
				setIconPx(40);
		}
	}, []);

	return (
		<div className="provider__icon__container" style={{height: containerPx, width: containerPx}}>
			<i className="fa-thin fa-user-doctor" style={{fontSize: iconPx}} />
		</div>
	);
}

export default ProviderIcon;
