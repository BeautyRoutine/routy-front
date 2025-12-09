import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/apiClient';
import { API_BASE_URL, ENDPOINTS } from '../components/user/layouts/headerConstants';
import './RankingPage.css';

// -------------------------------
// 카테고리 변환 함수
// -------------------------------
function transformCategoryData(data) {
  if (!data || typeof data !== 'object') return { top: [], tree: [] };

  const source = data.tree || data;

  const keys = Object.keys(source).filter(k => !isNaN(Number(k)));
  const sortedKeys = keys.sort((a, b) => Number(a) - Number(b));

  const tree = sortedKeys.map(key => {
    const item = source[key];
    const title = item.mainStr || item.title || item.name || '';

    const subMap = item.sub || item.subCategories || item.children || {};
    const subKeys = Object.keys(subMap).filter(k => !isNaN(Number(k)));

    const items = subKeys.map(subKey => {
      const subItem = subMap[subKey];
      return {
        id: Number(subKey),
        name: subItem?.name || subItem?.title || subItem || '',
      };
    });

    return { id: Number(key), title, items };
  });

  const top = tree.map(t => ({ id: t.id, name: t.title }));

  return { top, tree };
}

const RankingPage = ({ user_skin }) => {
  const navigate = useNavigate();

  const skinTypes = useMemo(() => ['전체', '지성', '건성', '민감성'], []);

  // 카테고리 및 랭킹 데이터 상태
  const [categories, setCategories] = useState([{ id: null, name: '전체' }]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [rankingList, setRankingList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 피부타입 필터 상태 (UI 전용, 기능은 추후 구현)
  const [selectedSkinType, setSelectedSkinType] = useState('전체');
  const skinTypes = ['전체', '건성', '지성', '민감성'];
  const [selectedSkinNum, setSelectedSkinNum] = useState(null);
  // user_skin prop 반영 - 메인 [내 피부 타입 맞춤 추천] 더보기 대응
  useEffect(() => {
    if (user_skin != null && user_skin >= 0 && user_skin < skinTypes.length) {
      setSelectedSkinNum(user_skin);
      setSelectedSkinType(skinTypes[user_skin]);
    } else {
      setSelectedSkinNum(null);
      setSelectedSkinType('전체');
    }
  }, [skinTypes, user_skin]);

  // 카테고리 데이터 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(ENDPOINTS.categoryTree || '/api/categories/main');
        const rawData = response.data?.data || response.data;
        const { top } = transformCategoryData(rawData);
        setCategories([{ id: null, name: '전체' }, ...top]);
      } catch (error) {
        console.error('카테고리 조회 실패:', error);
      }
    };
    fetchCategories();
  }, []);

  // 랭킹 데이터 불러오기
  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      try {
        const params = {
          limit: 20,
          ...(selectedCategory > 0 && { category: selectedCategory }),
          ...(selectedSkinNum > 0 && { skin: selectedSkinNum }),
        };

        // 1. 랭킹 리스트 조회
        const response = await api.get(`${API_BASE_URL}/api/products/ranking`, { params });
        const initialList = response.data.data || [];

        setRankingList(initialList); // 상세조회 제거 — 랭킹 API의 이미지 URL 그대로 사용
      } catch (error) {
        console.error('랭킹 조회 실패:', error);
        setRankingList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [selectedCategory, selectedSkinType, selectedSkinNum]);

  const handleProductClick = id => {
    navigate(`/products/${id}`);
  };

  const getImageUrl = img => `${process.env.PUBLIC_URL}/images/product/${img || 'no-image.png'}`;

  return (
    <div className="ranking-page container mt-4">
      <div className="mb-4">
        <h3 className="fw-bold mb-2">랭킹</h3>
        <p className="text-muted small mb-0">매일 오전 07시에 랭킹 초기화</p>
      </div>

      {/* 필터 섹션 */}
      <div className="filters mb-5">
        {/* 카테고리 필터 */}
        <div className="filter-group d-flex align-items-center mb-3">
          <span className="filter-label fw-bold me-4">카테고리</span>
          <div className="filter-options d-flex gap-2 overflow-auto">
            {categories.map(cat => (
              <button
                key={cat.id ?? 'all'}
                className={`btn btn-sm rounded-pill px-3 ${
                  selectedCategory === cat.id ? 'btn-primary' : 'btn-light text-secondary'
                }`}
                onClick={() => {
                  const newValue = cat.id === null ? null : cat.id;
                  if (selectedCategory === newValue) return; // 동일 클릭 시 리렌더 방지
                  setSelectedCategory(newValue);
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 피부타입 필터 (UI Only) */}
        <div className="filter-group d-flex align-items-center">
          <span className="filter-label fw-bold me-4">피부타입별</span>
          <div className="filter-options d-flex gap-2 flex-wrap">
            {skinTypes.map((type, index) => (
              <button
                key={type}
                className={`btn btn-sm rounded-pill px-3 ${
                  selectedSkinType === type ? 'btn-primary' : 'btn-light text-secondary'
                }`}
                onClick={() => {
                  setSelectedSkinType(type);
                  setSelectedSkinNum(index);
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 상품 그리드 */}
      {loading ? (
        <div className="text-center py-5">로딩 중...</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {rankingList.map((product, index) => (
            <div key={product.prdNo} className="col">
              <div className="card h-100 border-0 ranking-card" onClick={() => handleProductClick(product.prdNo)}>
                <div className="position-relative">
                  {/* 랭킹 뱃지 */}
                  <div className="ranking-badge position-absolute top-0 start-0 m-3">{index + 1}</div>
                  {/* 상품 이미지 */}
                  <img
                    src={getImageUrl(product.prdImg)}
                    alt={product.prdName}
                    className="card-img-top rounded-4"
                    style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                    onError={e => {
                      if (e.target.src.endsWith(`${process.env.PUBLIC_URL}/images/product/no-image.png`)) return;
                      e.target.src = `${process.env.PUBLIC_URL}/images/product/no-image.png`;
                    }}
                  />
                </div>

                <div className="card-body px-0 pt-3">
                  <h6 className="card-title fw-bold mb-2 text-truncate-2">{product.prdName}</h6>
                  <div className="price-area">
                    <span className="text-primary fw-bold fs-5">{product.prdPrice.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {rankingList.length === 0 && (
            <div className="col-12 text-center py-5">
              <p className="text-muted">랭킹 상품이 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RankingPage;
