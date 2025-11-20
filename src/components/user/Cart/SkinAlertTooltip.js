import React from 'react';
import PropTypes from 'prop-types';
import './CartPage.css';

export function SkinAlertTooltip({ item }) {
  if (!item || !item.skinAlert) {
    return null;
  }

  const { skinAlert } = item;
  let iconClass, tooltipType;

  switch (skinAlert.type) {
    case 'recommend':
      iconClass = 'bi bi-check-circle-fill text-recommend';
      tooltipType = 'recommend';
      break;
    case 'warning':
      iconClass = 'bi bi-exclamation-triangle-fill text-warning';
      tooltipType = 'warning';
      break;
    default:
      return null;
  }

  return (
    <div className="skin-alert-icon" data-tooltip={skinAlert.message} data-tooltip-type={tooltipType}>
      <i className={iconClass}></i>
    </div>
  );
}

SkinAlertTooltip.propTypes = {
  item: PropTypes.object,
};
