import React from 'react';
import FilterSidebar from '../../components/user/products/FilterSidebar';
import ProductListSection from '../../components/user/products/ProductListSection';
import './AllProductList.css';

const AllProductList = () => {
  return (
    <div className="all-product-list-page">
      <FilterSidebar />
      <ProductListSection />
    </div>
  );
};

export default AllProductList;
