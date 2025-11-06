import React from 'react';
import logo from 'logo.svg';
import PromoCarousel from 'components/user/layouts/PromoCarousel';
import CategoryCircleButtons from '../layouts/CategoryCircleButtons';
import RecommendedProducts from '../layouts/RecommendedProducts';
import SimilarSkinProducts from '../layouts/SimilarSkinProducts';
import Footer from '../layouts/Footer';
const Home = () => {
  return (
    <div className="container mt-5">
      <div className="text-center">
        <PromoCarousel />
        <CategoryCircleButtons />
        <RecommendedProducts />
        <SimilarSkinProducts />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
