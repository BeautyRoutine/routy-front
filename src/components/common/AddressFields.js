/**
 * 관리자 주소 입력폼을 별도의 컴포넌트로 분리
 * prefix : 범용적으로 쓸 수 있도록 필드명을 동적으로 조합하는 용도.
 */

import React from 'react';

const AddressFields = ({ item, setItem, handleChange, prefix }) => {
  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setItem(prev => ({
          ...prev,
          [`${prefix}Zip`]: data.zonecode,
          [`${prefix}JibunAddr`]: data.jibunAddress || data.autoJibunAddress,
          [`${prefix}RoadAddr`]: data.roadAddress,
          [`${prefix}BcCode`]: data.bcode,
        }));
      },
    }).open();
  };

  return (
    <>
      <tr>
        <th className="bg-light">우편번호</th>
        <td colSpan="2">
          <input
            type="text"
            name={`${prefix}Zip`}
            className="form-control bg-light"
            value={item[`${prefix}Zip`] || ''}
            readOnly
            onClick={handlePostcode}
          />
        </td>
        <td>
          <button type="button" className="btn btn-dark w-100" onClick={handlePostcode}>
            주소 검색
          </button>
        </td>
      </tr>

      <tr>
        <th className="bg-light">지번 주소</th>
        <td colSpan="3">
          <input
            type="text"
            name={`${prefix}JibunAddr`}
            className="form-control bg-light"
            value={item[`${prefix}JibunAddr`] || ''}
            readOnly
            onClick={handlePostcode}
          />
        </td>
      </tr>

      <tr>
        <th className="bg-light">도로명 주소</th>
        <td colSpan="3">
          <input
            type="text"
            name={`${prefix}RoadAddr`}
            className="form-control bg-light"
            value={item[`${prefix}RoadAddr`] || ''}
            readOnly
            onClick={handlePostcode}
          />
        </td>
      </tr>

      <tr>
        <th className="bg-light">상세 주소</th>
        <td colSpan="3">
          <input
            type="text"
            name={`${prefix}DetailAddr`}
            className="form-control"
            value={item[`${prefix}DetailAddr`] || ''}
            onChange={handleChange}
          />
        </td>
      </tr>

      <tr>
        <th className="bg-light">시군구 코드</th>
        <td colSpan="3">
          <input
            type="text"
            name={`${prefix}BcCode`}
            className="form-control bg-light"
            value={item[`${prefix}BcCode`] || ''}
            readOnly
            onClick={handlePostcode}
          />
        </td>
      </tr>
    </>
  );
};

export default AddressFields;
