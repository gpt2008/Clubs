import Modal from "antd/lib/modal/Modal";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

interface IProps {
	nameCartera?: string;
	visible?: boolean;
	onClose: (saved: boolean) => void;
	removeCartera: () => void;
}

class CarteraRemoveConfirmation extends React.Component<WithTranslation & IProps> {
	public render() {
		return (
			<Modal
				title={this.props.t("delete")}
				style={{ top: 40 }}
				onOk={() => this.props.removeCartera()}
				onCancel={() => this.props.onClose(false)}
				open={this.props.visible}
				destroyOnClose
				width={600}
				okText={this.props.t("buttons:yes")}
				cancelText={this.props.t("buttons:no")}>
				<span>
					{this.props.t("deleteCarteraMessage", {
						nameCartera: this.props.nameCartera,
					})}
				</span>
			</Modal>
		);
	}
}

export default withTranslation("carterasList")(CarteraRemoveConfirmation);