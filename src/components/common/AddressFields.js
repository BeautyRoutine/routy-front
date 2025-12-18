/**
 * 관리자 주소 입력폼을 별도의 컴포넌트로 분리
 * prefix : 범용적으로 쓸 수 있도록 필드명을 동적으로 조합하는 용도.
 */

import React, { useState, useCallback } from 'react';

import PostcodeLayer from 'components/common/PostcodeLayer';

const AddressFields = ({ item, setItem, handleChange, prefix }) => {
  const [showPostcode, setShowPostcode] = useState(false);

  const handleSelect = useCallback(
    data => {
      setItem(prev => ({
        ...prev,
        [`${prefix}Zip`]: data.zonecode,
        [`${prefix}JibunAddr`]: data.jibunAddress || data.autoJibunAddress,
        [`${prefix}RoadAddr`]: data.roadAddress,
        [`${prefix}BcCode`]: data.bcode,
      }));
    },
    [setItem, prefix],
  );

  const handleClose = useCallback(() => {
    setShowPostcode(false);
  }, []);

  return (
    <>
      {/* 주소 검색 레이어 */}
      <PostcodeLayer visible={showPostcode} onClose={handleClose} onSelect={handleSelect} />

      <tr>
        <th className="bg-light">우편번호</th>
        <td colSpan="2">
          <input
            type="text"
            name={`${prefix}Zip`}
            className="form-control bg-light"
            value={item[`${prefix}Zip`] || ''}
            readOnly
            onClick={() => setShowPostcode(true)}
          />
        </td>
        <td>
          <button type="button" className="btn btn-dark w-100" onClick={() => setShowPostcode(true)}>
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
            onClick={() => setShowPostcode(true)}
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
            onClick={() => setShowPostcode(true)}
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
            onClick={() => setShowPostcode(true)}
          />
        </td>
      </tr>
    </>
  );
};

export default AddressFields;
