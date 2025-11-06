import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import './PromoCarousel.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

const PromoCarousel = () => {
  const cards = [
    { 
      title: '메이크업 신상',
      subtitle: '트렌디한 컬러 라인',
      desc: '지금 바로 만나보세요',
      img: '/images/makeup.jpg',
      bg: 'bg-danger',
    },
    {
      title: '네이버 직원들이',
      subtitle: '월급 털어 사는 스토어',
      desc: '스토어의 발견',
      img: '/images/store.jpg',
      bg: 'bg-primary',
    },
    {
      title: '네이버+스토어에서',
      subtitle: 'MLB 시청권이 무료',
      desc: '지금 받으러 가기',
      img: '/images/mlb.jpg',
      bg: 'bg-success',
    },
    {
      title: '세럼 특가',
      subtitle: '고농축 영양 세럼',
      desc: '피부 속부터 탄탄하게',
      img: '/images/serum.jpg',
      bg: 'bg-warning',
    },
    {
      title: '스킨케어 위크',
      subtitle: '베스트 셀러 모음',
      desc: '지금 바로 보기',
      img: '/images/skincare.jpg',
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
            <div className={`card text-white ${card.bg} border-0 promo-card h-100`}>
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title fw-bold">{card.title}</h5>
                  <p className="card-text mb-1">{card.subtitle}</p>
                  <small className="opacity-75">{card.desc}</small>
                </div>
                <div className="text-end">
                  <img src={card.img} alt={card.title} className="promo-img rounded" />
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
