import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8085/api/admin/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>상품 목록</h2>
      {products.map(p => (
        <div key={p.prdNo}>
          {p.prdName} - {p.prdPrice}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
