import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import './PromoCarousel.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import banner1 from '../../../assets/banner/banner-1.jpg';
import banner2 from '../../../assets/banner/banner-2.jpg';
import banner3 from '../../../assets/banner/banner-3.png';
import banner4 from '../../../assets/banner/banner-4.jpg';
import banner5 from '../../../assets/banner/banner-5.jpg';

const PromoCarousel = () => {
  const cards = [
    {
      title: '피부 맞춤 솔루션',
      subtitle: '나만의 루틴 찾기',
      desc: 'AI 피부 분석으로 시작하세요',
      img: banner1,
      bg: 'bg-danger',
    },
    {
      title: '베스트 셀러',
      subtitle: '이달의 인기 제품',
      desc: '많은 분들이 선택했어요',
      img: banner2,
      bg: 'bg-primary',
    },
    {
      title: '신규 회원 혜택',
      subtitle: '첫 구매 할인',
      desc: '지금 가입하고 혜택받기',
      img: banner3,
      bg: 'bg-success',
    },
    {
      title: '시즌 특가',
      subtitle: '환절기 피부 관리',
      desc: '최대 50% 할인',
      img: banner4,
      bg: 'bg-warning',
    },
    {
      title: '리뷰 이벤트',
      subtitle: '생생한 후기',
      desc: '포인트 적립 기회',
      img: banner5,
      bg: 'bg-info',
    },
  ];

  return (
    <div className="container my-5">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        pagination={{
          type: 'progressbar', // ✅ 진행바 스타일
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        speed={800}
        loop={true}
        breakpoints={{
          992: { slidesPerView: 3 },
          768: { slidesPerView: 2 },
          0: { slidesPerView: 1 },
        }}
        className="promoSwiper"
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index}>
            <div className="card text-white border-0 promo-card h-100">
              <img src={card.img} alt={card.title} className="promo-bg-img" />
              <div className="promo-overlay">
                <div>
                  <h5 className="card-title fw-bold">{card.title}</h5>
                  <p className="card-text mb-1">{card.subtitle}</p>
                  <small className="opacity-75">{card.desc}</small>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PromoCarousel;
