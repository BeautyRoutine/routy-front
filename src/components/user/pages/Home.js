import React from 'react';
import logo from 'logo.svg';
import BannerCarousel from '../layouts/BannerCarousel';
const Home = () => {
  return (
    <div className="container mt-5">
      <div className="text-center">
        <BannerCarousel />
      </div>
    </div>
  );
};

export default Home;
