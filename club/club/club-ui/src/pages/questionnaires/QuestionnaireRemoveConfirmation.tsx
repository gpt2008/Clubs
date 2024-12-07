import Modal from "antd/lib/modal/Modal";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

interface IProps {
	nameQuestionnaire?: string;
	visible?: boolean;
	onClose: (saved: boolean) => void;
	removeQuestionnaire: () => void;
}

class QuestionnaireRemoveConfirmation extends React.Component<WithTranslation & IProps> {
	public render() {
		return (
			<Modal
				title={this.props.t("delete")}
				style={{ top: 40 }}
				onOk={() => this.props.removeQuestionnaire()}
				onCancel={() => this.props.onClose(false)}
				visible={this.props.visible}
				destroyOnClose
				width={600}
				okText={this.props.t("buttons:yes")}
				cancelText={this.props.t("buttons:no")}>
				<span>
					{this.props.t("deleteQuestionnaireMessage", {
						nameQuestionnaire: this.props.nameQuestionnaire,
					})}
				</span>
			</Modal>
		);
	}
}

export default withTranslation("questionnaireList")(QuestionnaireRemoveConfirmation);
