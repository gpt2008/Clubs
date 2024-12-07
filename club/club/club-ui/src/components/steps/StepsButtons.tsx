import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import "./StepsButtons.scss";

interface IProps {
	nextDisabled?: boolean;
	onBackClicked?: () => void;
	onNextClicked?: () => void;
}

const StepsButtons = (props: IProps) => {
	const { t } = useTranslation("common");

	return (
		<div className="steps__buttons">
			<div>
				{props.onBackClicked && (
					<Button onClick={props.onBackClicked}>
						<FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: "8px" }} />
						{t("back")}
					</Button>
				)}
			</div>
			<div>
				{props.onNextClicked && (
					<Button type="primary" onClick={props.onNextClicked} disabled={props.nextDisabled}>
						{t("next")}
						<FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "8px" }} />
					</Button>
				)}
			</div>
		</div>
	);
};

export default StepsButtons;
