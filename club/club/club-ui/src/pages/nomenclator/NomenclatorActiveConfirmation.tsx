import Modal from "antd/lib/modal/Modal";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

interface IProps {
	nameSpeciality?: string;
    nameSubspeciality?: string;
    nameAct?: string;
	visible?: boolean;
	onClose: (saved: boolean) => void;
	activateNomenclator: () => void;
}

class NomenclatorActivateConfirmation extends React.Component<WithTranslation & IProps> {
	public render() {
		return (
			<Modal
				title={this.props.t("activate")}
				style={{ top: 40 }}
				onOk={() => this.props.activateNomenclator()}
				onCancel={() => this.props.onClose(false)}
				open={this.props.visible}
				destroyOnClose
				width={600}
				okText={this.props.t("buttons:yes")}
				cancelText={this.props.t("buttons:no")}>
				<span>
					{this.props.t("activateNomenclatorMessage", {
						nameSpeciality: this.props.nameSpeciality,
						nameSubspeciality: this.props.nameSubspeciality,
						nameAct: this.props.nameAct

					})}
				</span>
			</Modal>
		);
	}
}

export default withTranslation("nomenclatorList")(NomenclatorActivateConfirmation);
