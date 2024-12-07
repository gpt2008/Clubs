import React from 'react';
import { useTranslation } from 'react-i18next';

import Interstitial from './Interstitial';

import './TokenNoValido.scss';

const TokenNoValido = () => {

    const { t } = useTranslation('landing');

    return (
        <Interstitial>
            <div className='oops__container'>
                <div className='oops__image' />
                <div className='oops__message'> {t('tokenNoValido')} </div>
            </div>
        </Interstitial>
    );
}

export default TokenNoValido;