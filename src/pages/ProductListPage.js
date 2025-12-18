import React, { useState, useEffect } from 'react';
import api from '../lib/apiClient';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyPageData } from 'features/user/userSlice';
import CategoryFilter from '../components/user/product/CategoryFilter';
import ProductGrid from '../components/user/product/ProductGrid';
import './ProductListPage.css';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  /* ===============================
     query param 정규화 (핵심)
  =============================== */
  const from = searchParams.get('from') || '';

  const rawSkin = searchParams.get('skin');
  const skin =
    rawSkin === null || rawSkin === '' || rawSkin === 'undefined'
      ? null
      : Number(rawSkin);

  const maincate = searchParams.get('maincate') || '';
  const subcate = searchParams.get('subcate') || '';
  const min_price = searchParams.get('min_price') || '';
  const max_price = searchParams.get('max_price') || '';
  const brand = searchParams.get('brand') || '';
  const limit = Number(searchParams.get('limit')) || 20;
  const searchKeyword = searchParams.get('search') || '';

  /* ===============================
     상품 목록 로드
  =============================== */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        let res;

        // 🔍 검색
        if (searchKeyword) {
          res = await api.get('/api/search', {
            params: { keyword: searchKeyword },
          });

        // ⭐ 피부타입 추천 진입
        } else if (from === 'skin') {
          res = await api.get('/api/products/list/skin_cate', {
            params: {
              limit,
              maincate,
              subcate,
              skin, // ← null or number (절대 'undefined' 아님)
            },
          });

        // 📦 일반 전체 상품
        } else {
          res = await api.get('/api/products/list', {
            params: {
              limit,
              maincate,
              subcate,
              min_price,
              max_price,
              brand,
              skin,
            },
          });
        }

        setProducts(res?.data?.data || []);
      } catch (err) {
        console.error('상품 목록 조회 실패:', err);
      }
    };

    loadProducts();
  }, [
    from,
    limit,
    maincate,
    subcate,
    min_price,
    max_price,
    brand,
    skin,
    searchKeyword,
  ]);

  /* ===============================
     좋아요 정보 로드
  =============================== */
  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchMyPageData(currentUser.userId));
    }
  }, [currentUser?.userId, dispatch]);

  return (
    <div className="container mt-4 product-page-container">
      <p className="fw-bold mb-3 text-muted">
        전체 {products.length}개 상품
      </p>

      <div className="row">
        <div className="col-3">
          <CategoryFilter />
        </div>

        <div className="col-9">
          <ProductGrid products={products} />

          <div className="text-center my-5">
            <button className="btn btn-outline-primary rounded-pill px-4">
              상품 더보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
