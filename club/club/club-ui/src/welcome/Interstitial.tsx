import React from "react";

import "./Interstitial.scss";
//import LogoEBC from '../../images/logoEBColor.png';
//import { COLLECTIVE_MODS_INSTANCE as CollectiveMods } from '../../utils/userInfo';

export default class Interstitial extends React.Component {
  render = () => {
    return (
      <div className="interstitial-container">
        <div className="content">
          <div className="logos">
            {/*<div className='logo'><img src={LogoEBC} alt=''/></div>*/}
            {/*<div className='logo2'><img src={CollectiveMods.welcomeLogo} alt=''/></div>*/}
          </div>
          <div className="content-inner">{}</div>
        </div>
      </div>
    );
  };
}
