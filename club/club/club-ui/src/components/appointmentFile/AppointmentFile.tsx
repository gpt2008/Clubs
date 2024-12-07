import { faDownload, faFile, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { color_primary } from "css/theme";
import "./AppointmentFile.scss";

interface IProps {
	file: {
		id: number;
		name: string;
		type: number;
	};
}

function AppointmentFile(props: IProps) {
	const downloadFile = (idFile: number) => {
		fetch(URL + "/file?af&idFile=" + idFile)
			.then((response) => response.blob())
			.then((blob) => {
				if (blob.size > 0) {
					const url = window.URL.createObjectURL(new Blob([blob]));
					const link = document.createElement("a");
					link.href = url;
					link.setAttribute("download", props.file.name);
					document.body.appendChild(link);
					link.click();
					link.parentNode!.removeChild(link);
				}
			});
	};

	return (
		<div className="appointment__file__container">
			<div className="appointment__file__container__info">
				<FontAwesomeIcon icon={props.file.type == 1 ? faImage : faFile} />
				<div>{props.file.name}</div>
			</div>
			<Button
				onClick={() => downloadFile(props.file.id)}
				type="text"
				icon={<FontAwesomeIcon style={{ color: color_primary }} icon={faDownload} />}></Button>
		</div>
	);
}

export default AppointmentFile;
