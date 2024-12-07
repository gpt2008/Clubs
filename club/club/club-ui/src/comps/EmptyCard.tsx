import { faHandPointer, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
	searching: boolean;
	description: string;
	isService?: boolean;
}

const EmptyCard = (props: IProps) => {
	return (
		<div className={props.isService ? "empty--card service" : "empty--card"}>
			<FontAwesomeIcon
				className="empty--card--icon"
				icon={props.searching ? faMagnifyingGlass : faHandPointer}
			/>
			<span className="empty--card--description">{props.description}</span>
		</div>
	);
};

export default EmptyCard;
