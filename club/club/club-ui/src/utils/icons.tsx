import { CSSProperties } from "react";

import { faAddressBook } from "@fortawesome/free-solid-svg-icons/faAddressBook";
import { faBaby } from "@fortawesome/free-solid-svg-icons/faBaby";
import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons/faBirthdayCake";
import { faBriefcaseMedical } from "@fortawesome/free-solid-svg-icons/faBriefcaseMedical";
import { faBuilding } from "@fortawesome/free-solid-svg-icons/faBuilding";
import { faBusAlt } from "@fortawesome/free-solid-svg-icons/faBusAlt";
import { faCarCrash } from "@fortawesome/free-solid-svg-icons/faCarCrash";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons/faCaretRight";
import { faCarSide } from "@fortawesome/free-solid-svg-icons/faCarSide";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faDizzy } from "@fortawesome/free-solid-svg-icons/faDizzy";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons/faDollarSign";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons/faEnvelopeOpenText";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons/faFileAlt";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons/faFileExcel";
import { faFileImage } from "@fortawesome/free-solid-svg-icons/faFileImage";
import { faFileMedical } from "@fortawesome/free-solid-svg-icons/faFileMedical";
import { faFileMedicalAlt } from "@fortawesome/free-solid-svg-icons/faFileMedicalAlt";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons/faFilePdf";
import { faFileWord } from "@fortawesome/free-solid-svg-icons/faFileWord";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons/faFolderOpen";
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons/faHeartbeat";
import { faHouseUser } from "@fortawesome/free-solid-svg-icons/faHouseUser";
import { faLifeRing } from "@fortawesome/free-solid-svg-icons/faLifeRing";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons/faMapMarkerAlt";
import { faPhoneAlt } from "@fortawesome/free-solid-svg-icons/faPhoneAlt";
import { faPills } from "@fortawesome/free-solid-svg-icons/faPills";
import { faPlane } from "@fortawesome/free-solid-svg-icons/faPlane";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { faSms } from "@fortawesome/free-solid-svg-icons/faSms";
import { faStarHalfAlt } from "@fortawesome/free-solid-svg-icons/faStarHalfAlt";
import { faStoreAltSlash } from "@fortawesome/free-solid-svg-icons/faStoreAltSlash";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons/faTrashAlt";
import { faUmbrella } from "@fortawesome/free-solid-svg-icons/faUmbrella";
import { faUmbrellaBeach } from "@fortawesome/free-solid-svg-icons/faUmbrellaBeach";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons/faUserFriends";
import { faUserMd } from "@fortawesome/free-solid-svg-icons/faUserMd";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons/faUserMinus";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";
import { faUsersCog } from "@fortawesome/free-solid-svg-icons/faUsersCog";
import { faUtensils } from "@fortawesome/free-solid-svg-icons/faUtensils";
import { faVenusMars } from "@fortawesome/free-solid-svg-icons/faVenusMars";
import { faVideo } from "@fortawesome/free-solid-svg-icons/faVideo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import enumFileType from "types/enums/EnumFileType";
import EnumRequestType from "types/enums/EnumRequestType";

const PRIMARY_BUTTON_ICON_STYLE: CSSProperties = { color: "#ffffff" };

export default {
	COMMON_ICON_STYLE: { color: "#1890ff", width: "2rem", fontSize: "1.5rem", marginRight: "0.5rem" },

	PRIMARY_BUTTON_ICON_STYLE,

	getProductIconByCode(productCode: string, style?: CSSProperties) {
		switch (productCode) {
			case "HEA":
				return (
					<FontAwesomeIcon icon={faHeartbeat} style={{ ...this.COMMON_ICON_STYLE, ...style }} />
				);
			case "LIF":
				return (
					<FontAwesomeIcon icon={faLifeRing} style={{ ...this.COMMON_ICON_STYLE, ...style }} />
				);
			case "TIC":
				return (
					<FontAwesomeIcon icon={faUtensils} style={{ ...this.COMMON_ICON_STYLE, ...style }} />
				);
			case "KIN":
				return <FontAwesomeIcon icon={faBaby} style={{ ...this.COMMON_ICON_STYLE, ...style }} />;
			case "CAR":
				return <FontAwesomeIcon icon={faCarSide} style={{ ...this.COMMON_ICON_STYLE, ...style }} />;
			case "TRI":
				return <FontAwesomeIcon icon={faPlane} style={{ ...this.COMMON_ICON_STYLE, ...style }} />;
			case "HOM":
				return (
					<FontAwesomeIcon icon={faHouseUser} style={{ ...this.COMMON_ICON_STYLE, ...style }} />
				);
			case "TRA":
				return <FontAwesomeIcon icon={faBusAlt} style={{ ...this.COMMON_ICON_STYLE, ...style }} />;
			case "ACC":
				return (
					<FontAwesomeIcon icon={faCarCrash} style={{ ...this.COMMON_ICON_STYLE, ...style }} />
				);
			default:
				return (
					<FontAwesomeIcon icon={faUmbrella} style={{ ...this.COMMON_ICON_STYLE, ...style }} />
				);
		}
	},
	getIconByCode(productCode: string, style?: CSSProperties) {
		switch (productCode) {
			case "USER":
				return (
					<FontAwesomeIcon
						icon={faUser}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "COLLECTIVE":
				return (
					<FontAwesomeIcon
						icon={faBuilding}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "QUESTION":
				return (
					<FontAwesomeIcon
						icon={faQuestionCircle}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "USERPLUS":
				return (
					<FontAwesomeIcon
						icon={faUserPlus}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "MONEY":
				return (
					<FontAwesomeIcon
						icon={faDollarSign}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "BAN":
				return (
					<FontAwesomeIcon
						icon={faBan}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "PHONE":
				return (
					<FontAwesomeIcon
						icon={faPhoneAlt}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "ENVELOPE":
				return (
					<FontAwesomeIcon
						icon={faEnvelope}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "GENDER":
				return (
					<FontAwesomeIcon
						icon={faVenusMars}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "BIRTH":
				return (
					<FontAwesomeIcon
						icon={faBirthdayCake}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "DIZZY":
				return (
					<FontAwesomeIcon
						icon={faDizzy}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "PRESCRIPTION":
				return (
					<FontAwesomeIcon
						icon={faFileMedical}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "ANALYTIC":
				return (
					<FontAwesomeIcon
						icon={faFileMedicalAlt}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "PILLS":
				return (
					<FontAwesomeIcon
						icon={faPills}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "MEDICALCASE":
				return (
					<FontAwesomeIcon
						icon={faBriefcaseMedical}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "FOLDER":
				return (
					<FontAwesomeIcon
						icon={faFolderOpen}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "HOLIDAYS":
				return (
					<FontAwesomeIcon
						icon={faUmbrellaBeach}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "MARKER":
				return (
					<FontAwesomeIcon
						icon={faMapMarkerAlt}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "ENVELOPE_OPEN":
				return (
					<FontAwesomeIcon
						icon={faEnvelopeOpenText}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "COG":
				return (
					<FontAwesomeIcon
						icon={faCog}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "USER_MD":
				return (
					<FontAwesomeIcon
						icon={faUserMd}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "STOTE":
				return (
					<FontAwesomeIcon
						icon={faStoreAltSlash}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "TRASH":
				return (
					<FontAwesomeIcon
						icon={faTrashAlt}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "NOTIFICATION":
				return (
					<FontAwesomeIcon
						icon={faSms}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "EDIT":
				return (
					<FontAwesomeIcon
						icon={faEdit}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "WAITINGLIST":
				return (
					<FontAwesomeIcon
						icon={faUsersCog}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "SURVEY":
				return (
					<FontAwesomeIcon
						icon={faStarHalfAlt}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "CARETRIGHT":
				return (
					<FontAwesomeIcon
						icon={faCaretRight}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case "HEART":
				return (
					<FontAwesomeIcon
						icon={faHeartbeat}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			default:
		}
	},

	getRequestIconByType(requestType: number, style?: CSSProperties) {
		switch (requestType) {
			case EnumRequestType.POLICYCANCELLATION:
				return (
					<FontAwesomeIcon
						icon={faUserMinus}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case EnumRequestType.NEWINSURED:
				return (
					<FontAwesomeIcon
						icon={faUserPlus}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case EnumRequestType.CAPITALINCREASE:
				return (
					<FontAwesomeIcon
						icon={faDollarSign}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			case EnumRequestType.INSUREDADDRESSCHANGE:
				return (
					<FontAwesomeIcon
						icon={faAddressBook}
						style={{ ...this.COMMON_ICON_STYLE, ...style }}
						className="icon-color"
					/>
				);
			default:
		}
	},

	getFileIconByType(typeMime: string, style?: CSSProperties) {
		if (typeMime === enumFileType.PDF) {
			return (
				<FontAwesomeIcon
					icon={faFilePdf}
					style={{ ...this.COMMON_ICON_STYLE, ...style }}
					className="icon-color"
				/>
			);
		} else if (typeMime.includes(enumFileType.IMAGE)) {
			return (
				<FontAwesomeIcon
					icon={faFileImage}
					style={{ ...this.COMMON_ICON_STYLE, ...style }}
					className="icon-color"
				/>
			);
		} else if (
			typeMime === enumFileType.EXCEL ||
			typeMime === enumFileType.EXCELSS ||
			typeMime === enumFileType.EXCELXLSX
		) {
			return (
				<FontAwesomeIcon
					icon={faFileExcel}
					style={{ ...this.COMMON_ICON_STYLE, ...style }}
					className="icon-color"
				/>
			);
		} else if (
			typeMime === enumFileType.DOCMSW ||
			typeMime === enumFileType.DOCT ||
			typeMime === enumFileType.DOCX ||
			typeMime === enumFileType.DOCTP
		) {
			return (
				<FontAwesomeIcon
					icon={faFileWord}
					style={{ ...this.COMMON_ICON_STYLE, ...style }}
					className="icon-color"
				/>
			);
		} else {
			return (
				<FontAwesomeIcon
					icon={faFileAlt}
					style={{ ...this.COMMON_ICON_STYLE, ...style }}
					className="icon-color"
				/>
			);
		}
	},

	getAppointmentTypeIcon(flagOnline: boolean, name: string, style?: CSSProperties) {
		const STYLE_CONTAINER = { display: "flex", justifyContent: "flex-start", alignItems: "center" };
		const STYLE_ICON_CONTAINER = {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			width: "1.75rem",
			height: "1.75rem",
			fontSize: "1rem",
			marginRight: "0.75rem",
			borderRadius: "0.25rem",
			backgroundColor: "#1890ff",
		};

		if (flagOnline) {
			return (
				<div style={STYLE_CONTAINER}>
					<div style={{ ...STYLE_ICON_CONTAINER, ...style }}>
						<FontAwesomeIcon icon={faVideo} style={{ color: "white" }} />
					</div>
					{name}
				</div>
			);
		}

		return (
			<div style={STYLE_CONTAINER}>
				<div style={{ ...STYLE_ICON_CONTAINER, ...style }}>
					<FontAwesomeIcon icon={faUserFriends} style={{ color: "white" }} />
				</div>
				{name}
			</div>
		);
	},
};
