import React from 'react';
import logo from 'logo.svg';
import PromoCarousel from 'components/user/layouts/PromoCarousel';
import CategoryCircleButtons from 'components/user/layouts/CategoryCircleButtons';
import RecommendedProducts from 'components/user/layouts/RecommendedProducts';
import SimilarSkinProducts from 'components/user/layouts/SimilarSkinProducts';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="text-center">
        <PromoCarousel />
        <CategoryCircleButtons />
        <RecommendedProducts />
        <SimilarSkinProducts />
      </div>
    </div>
  );
};

export default Home;
