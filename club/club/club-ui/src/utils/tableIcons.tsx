import React, { CSSProperties } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkedAlt';
import { faEye, faLink, faNotesMedical, faVolumeMute, faVolumeUp, IconDefinition, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';

enum TableIcon {
    filter,
    reload,
    chevronDownRow,
    chevronDown,
    chevronUp,
    chevronLeft,
    edit,
    trash,
    noAvatar,
    more,
    plus,
    download,
    close,
    check,
    link,
    noLocationLogo,
    cmbd,
    volumeUp,
    volumeMute,
    eye,
    trashUndo,
    arrowRigh,
    arrowLeft
};

enum DotColor {
    green,
    red,
    gray,
    blue,
    orange
}

const PRIMARY_BUTTON_ICON_STYLE: CSSProperties = {marginRight: '0.5rem', color: '#1890ff'};
const PRIMARY: CSSProperties = {color: '#1890ff'};

export default {
    TableIcon, DotColor, PRIMARY_BUTTON_ICON_STYLE, PRIMARY,

    getTableIcon(icon: TableIcon, style?: CSSProperties) {
        switch (icon) {
            case TableIcon.filter:
                return <FontAwesomeIcon icon={faFilter} />;
            case TableIcon.reload:
                return <FontAwesomeIcon icon={faSync} />;
            case TableIcon.chevronDownRow:
                return <FontAwesomeIcon icon={faChevronDown} style={{marginLeft: '0.5rem', color: '#1890ff'}}/>;
            case TableIcon.chevronDown:
                return <FontAwesomeIcon icon={faChevronDown} />;
            case TableIcon.chevronUp:
                return <FontAwesomeIcon icon={faChevronUp} />;
            case TableIcon.chevronLeft:
                return <FontAwesomeIcon icon={faChevronLeft} />;
            case TableIcon.edit:
                return <FontAwesomeIcon icon={faPen} />;
            case TableIcon.trash:
                return <FontAwesomeIcon icon={faTrashAlt} />;
            case TableIcon.noAvatar:
                return <FontAwesomeIcon icon={faUserCircle} style={{color: '#A2A2A2', fontSize: '1.75rem'}} />
            case TableIcon.more:
                return <FontAwesomeIcon icon={faEllipsisV} />
            case TableIcon.plus:
                return <FontAwesomeIcon icon={faPlus} />  
            case TableIcon.download:
                return <FontAwesomeIcon icon={faDownload} />  
            case TableIcon.close:
                return <FontAwesomeIcon icon={faTimes} />  
            case TableIcon.check:
                return <FontAwesomeIcon icon={faCheck} style={{color: '#52c41a'}}/>  
            case TableIcon.noLocationLogo:
                return <FontAwesomeIcon icon={faMapMarkedAlt} style={style}/>
            case TableIcon.volumeUp:
                return <FontAwesomeIcon icon={faVolumeUp} />;
            case TableIcon.volumeMute:
                return <FontAwesomeIcon icon={faVolumeMute} />;
                case TableIcon.link:
                return <FontAwesomeIcon icon={faLink} style={{marginRight: '0.5rem', color: '#1890ff'}}/>  
            case TableIcon.cmbd:
                return <FontAwesomeIcon icon={faNotesMedical} style={style}/>
            case TableIcon.eye:
                return <FontAwesomeIcon icon={faEye} />;
            case TableIcon.trashUndo:
                return <i className="fa-solid fa-trash-can-undo"></i>;
            case TableIcon.arrowRigh:
                return <FontAwesomeIcon icon={faArrowRight} />;
            case TableIcon.arrowLeft:
                return <i className="fa-regular fa-arrow-turn-left"></i>;
            }
           
    },

    getStatusTypeIcon(text: string, color: DotColor, style?: CSSProperties) {

        const STYLE = {display:'flex', alignItems:'center', justifyContent:'flex-start', width: '8rem'};

        switch (color) {
            case DotColor.green:
                return <div style={style ? style : STYLE}>
                    <FontAwesomeIcon icon={faCircle} style={{color: '#8EAD38', marginRight: '0.5rem'}}/> {text} </div>;
            case DotColor.red:
                return <div style={style ? style : STYLE}>
                    <FontAwesomeIcon icon={faCircle} style={{color: '#CD6663', marginRight: '0.5rem'}}/> {text} </div>;
            case DotColor.gray:
                return <div style={style ? style : STYLE}>
                    <FontAwesomeIcon icon={faCircle} style={{color: '#A5A5A5', marginRight: '0.5rem'}}/> {text} </div>;
            case DotColor.blue:
                return <div style={style ? style : STYLE}>
                    <FontAwesomeIcon icon={faCircle} style={{color: '#4F94CD', marginRight: '0.5rem'}}/> {text} </div>;
            case DotColor.orange:
                return <div style={style ? style : STYLE}>
                    <FontAwesomeIcon icon={faCircle} style={{color: '#FC9518', marginRight: '0.5rem'}}/> {text} </div>;
        }
    },

    getPortfolioServiceOnlineIcon(icon: IconDefinition, color: DotColor, style?: CSSProperties) {
        const STYLE = {display:'flex', justifyContent:'center', width: '100%'};

        switch (color) {
            case DotColor.green:
                return <span style={style ? style : STYLE}>
                    <FontAwesomeIcon icon={faCircle} style={{color: '#8EAD38', marginRight: '0.5rem'}}/><FontAwesomeIcon icon={icon} /></span>;
            case DotColor.gray:
                return <span style={style ? style : STYLE}>
                    <FontAwesomeIcon icon={faCircle} style={{color: '#A5A5A5', marginRight: '0.5rem'}}/><FontAwesomeIcon icon={icon} /></span>;
        }
    },

    getScheduleTypeIcon(text: string, color: DotColor, style?: CSSProperties) {

        const STYLE = { alignItems: 'center', justifyContent: 'flex-start', fontSize: '0.9rem', marginLeft: '0.33rem' };

        switch (color) {
            case DotColor.green:
                return <Tooltip title={text}>
                    <FontAwesomeIcon icon={faCircle} style={{ ...STYLE, color: '#8ead38' }} />
                </Tooltip>;
            case DotColor.red:
                return <Tooltip title={text}>
                    <FontAwesomeIcon icon={faCircle} style={{ ...STYLE, color: '#cd6763' }} />
                </Tooltip>;
        }
    },
}