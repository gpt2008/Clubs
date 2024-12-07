import Modal from "antd/lib/modal/Modal";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

interface IProps {
	nameSpeciality?: string;
	visible?: boolean;
	onClose: (saved: boolean) => void;
	removeSpeciality: () => void;
}

class SpecialityRemoveConfirmation extends React.Component<WithTranslation & IProps> {
	public render() {
		return (
			<Modal
				title={this.props.t("delete")}
				style={{ top: 40 }}
				onOk={() => this.props.removeSpeciality()}
				onCancel={() => this.props.onClose(false)}
				open={this.props.visible}
				destroyOnClose
				width={600}
				okText={this.props.t("buttons:yes")}
				cancelText={this.props.t("buttons:no")}>
				<span>
					{this.props.t("deleteSpecialityMessage", {
						nameSpeciality: this.props.nameSpeciality,
					})}
				</span>
			</Modal>
		);
	}
}

export default withTranslation("specialityList")(SpecialityRemoveConfirmation);
