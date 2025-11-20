import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IngredientList = () => {
  const [ingredients, setIngredients] = useState([]);

  // 첫 로드 시 성분 목록 조회
  useEffect(() => {
    axios
      .get('http://localhost:8085/api/admin/ingredients')
      .then(res => {
        setIngredients(res.data);
      })
      .catch(err => {
        console.error('성분 목록 불러오기 실패:', err);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">성분 목록</h2>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th style={{ width: '80px' }}>번호</th>
            <th style={{ width: '200px' }}>성분명</th>
            <th style={{ width: '150px' }}>알러지</th>
            <th>설명</th>
          </tr>
        </thead>

        <tbody>
          {ingredients.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                등록된 성분이 없습니다.
              </td>
            </tr>
          ) : (
            ingredients.map(ing => (
              <tr key={ing.ingNo}>
                <td>{ing.ingNo}</td>
                <td>{ing.ingName}</td>
                <td>{ing.ingAllergen}</td>
                <td>{ing.ingDesc}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientList;
