import React from 'react';
import PromoCarousel from 'components/user/layouts/PromoCarousel';
import SimilarSkinProducts from 'components/user/layouts/SimilarSkinProducts';
import RecentViewedRecommend from 'components/user/layouts/RecentViewedRecommend';
import PopularProducts from 'components/user/layouts/PopularProducts';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="text-center">
        <PromoCarousel />
        <RecentViewedRecommend />
        <PopularProducts />
        <SimilarSkinProducts />
      </div>
    </div>
  );
};

export default Home;
