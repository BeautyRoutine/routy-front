import React from 'react';
import '../../../styles/SkinProfileSetup.css';

const Step1SkinType = ({ selectedValue, onSelect }) => {
  const skinTypes = [
    { value: 1, label: '지성', desc: '번들거림과 넓은 모공' },
    { value: 2, label: '건성', desc: '피부가 당기고 각질 발생' },
    { value: 3, label: '민감성', desc: '아토피 또는 약한 피부 장벽으로 외부 요인에 과민 반응' },
    { value: 6, label: '선택안함', desc: '피부 타입을 잘 모르겠음' },
  ];

  return (
    <div className="skin-profile-step">
      <h2>당신의 피부 타입을 선택해주세요</h2>
      <p className="step-description">가장 가까운 피부 타입을 선택하면 맞춤형 추천을 받을 수 있습니다</p>

      <div className="skin-type-grid">
        {skinTypes.map(skin => (
        {skinTypes.map(skin => (
          <div
            key={skin.value}
            className={`skin-type-card ${selectedValue === skin.value ? 'active' : ''}`}
            onClick={() => onSelect(skin.value)}
          >
            <div className="skin-type-icon">
              {skin.value === 1 && '💧'}
              {skin.value === 2 && '🧊'}
              {skin.value === 3 && '🌊'}
              {skin.value === 6 && '☁️'}
            </div>
            <h3>{skin.label}</h3>
            <p>{skin.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step1SkinType;
