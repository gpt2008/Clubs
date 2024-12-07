import { Modal } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

interface IProps {
    visible?: boolean;
    nameProvider?: string;
    nameSchedule?: string;
    activate?: boolean;
    drop?: boolean
    onCancel: () => void;
    save: () => void;
}

const ScheduleActionsForm = (props: IProps) => {

    const { t } = useTranslation(['scheduleManagement']);

    return (
        (<Modal
            open={props.visible || false}
            style={{ top: 40 }}
            okText={t('buttons:ok')}
            cancelText={t('buttons:cancel')}
            onCancel={props.onCancel}
            onOk={props.save}
            destroyOnClose
            width={600} >
            <div>
                {props.drop ?
                    t('deleteModalTitle', {nameProvider: props.nameProvider, nameSchedule: props.nameSchedule})
                : props.activate ?
                    t('activateModalTitle', {nameSchedule: props.nameSchedule})
                :
                    t('deactivateModalTitle', {nameSchedule: props.nameSchedule})
                }
            </div>
        </Modal>)
    );
    
}
export default ScheduleActionsForm;