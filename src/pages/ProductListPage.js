import React, { useState, useEffect } from 'react';
import api from '../lib/apiClient';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyPageData } from 'features/user/userSlice';
import CategoryFilter from '../components/user/product/CategoryFilter';
import ProductGrid from '../components/user/product/ProductGrid';
import SortBar from '../components/user/product/SortBar';
import './ProductListPage.css';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('popular');

  const [searchParams] = useSearchParams();

  // 필터 값들 (의존성 관리를 위해 미리 변수로 추출)
  const min_price = searchParams.get('min_price') || null;
  const max_price = searchParams.get('max_price') || null;
  const brand = searchParams.get('brand') || null; // CSV
  const skin = searchParams.get('skin') || null;
  const maincate = searchParams.get('maincate') || null;
  const subcate = searchParams.get('subcate') || null;

  const limit = searchParams.get('limit') || 20;
  const searchKeyword = searchParams.get('search') || null;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        let res;
        if (searchKeyword) {
          // 검색어가 있을 경우 검색 API 호출
          res = await api.get('/api/search', {
            params: {
              keyword: searchKeyword,
            },
          });
        } else {
          // 검색어가 없을 경우 기존 상품 목록 API 호출
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

        setProducts(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadProducts();
  }, [limit, maincate, subcate, min_price, max_price, brand, skin, searchKeyword]); // 모든 search params가 변하면 API 재실행

  // 좋아요 로드
  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchMyPageData(currentUser.userId));
    }
  }, [currentUser?.userId, dispatch]);

  return (
    <div className="container mt-4 product-page-container">
      <p className="fw-bold mb-3 text-muted">전체 {products.length}개 상품</p>

      <div className="row">
        <div className="col-3">
          <CategoryFilter />
        </div>

        <div className="col-9">
          <div className="mb-3">
            <SortBar total={products.length} sort={sort} onSortChange={setSort} />
          </div>

          <ProductGrid products={products} />

          <div className="text-center my-5">
            <button className="btn btn-outline-primary rounded-pill px-4">상품 더보기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
