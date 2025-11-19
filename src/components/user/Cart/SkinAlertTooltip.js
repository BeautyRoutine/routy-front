import React from 'react';
import PropTypes from 'prop-types';
import './CartPage.css'; // 공통 CSS 사용

export function SkinAlertTooltip({ item }) {
  const { skinAlert } = item;
  if (!skinAlert) return null;

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
    case 'duplicate':
      iconClass = 'bi bi-lightning-fill text-duplicate';
      tooltipType = 'duplicate';
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
  item: PropTypes.object.isRequired,
};
