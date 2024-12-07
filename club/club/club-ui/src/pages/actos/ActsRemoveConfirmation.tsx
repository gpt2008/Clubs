import Modal from "antd/lib/modal/Modal";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

interface IProps {
	nameAct?: string;
	visible?: boolean;
	onClose: (saved: boolean) => void;
	removeAct: () => void;
}

class ActRemoveConfirmation extends React.Component<WithTranslation & IProps> {
	public render() {
		return (
			<Modal
				title={this.props.t("delete")}
				style={{ top: 40 }}
				onOk={() => this.props.removeAct()}
				onCancel={() => this.props.onClose(false)}
				open={this.props.visible}
				destroyOnClose
				width={600}
				okText={this.props.t("buttons:yes")}
				cancelText={this.props.t("buttons:no")}>
				<span>
					{this.props.t("deleteActMessage", {
						nameAct: this.props.nameAct,
					})}
				</span>
			</Modal>
		);
	}
}

export default withTranslation("actsList")(ActRemoveConfirmation);
