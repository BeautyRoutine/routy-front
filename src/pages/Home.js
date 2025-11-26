import React from 'react';
import PromoCarousel from 'components/user/layouts/PromoCarousel';
import RecommendedProducts from 'components/user/layouts/RecommendedProducts';
import SimilarSkinProducts from 'components/user/layouts/SimilarSkinProducts';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="text-center">
        <PromoCarousel />
        <RecommendedProducts />
        <SimilarSkinProducts />
      </div>
    </div>
  );
};

export default Home;
