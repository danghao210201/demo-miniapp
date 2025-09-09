import Section from "@/components/section";
import { Text, Icon } from "zmp-ui";
import checkInHotData from "@/components/mock/nhahang.json";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
const { Title } = Text;

/**
 * Component hiển thị danh sách các địa danh du lịch nổi tiếng ở dạng slider cover
 * - Cho thấy ~1/2 slide tiếp theo bằng slidesPerView=1.5
 * - Ảnh cover 16:9 với overlay gradient và text overlay
 * - Sử dụng Swiper với autoplay, loop và pagination
 */
export default function FeaturedNhaHang() {
  // Lấy 4 địa danh đầu tiên để hiển thị
  const featuredSites = checkInHotData.slice(0, 4);

  return (
    <Section
      className="pt-5"
      title="Nhà hàng"
      viewMore="/services"
    >
      <br/>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={16}
        slidesPerView={1.5}
        centeredSlides={false}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
      >
        {featuredSites.map((site, index) => (
          <SwiperSlide key={index}>
            <div className="relative rounded-xl overflow-hidden">
              <div className="aspect-[16/9] relative w-full">
                <img
                  src={site.HinhAnh[0]}
                  alt={site.TenDiaDiem}
                  className="absolute w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback image nếu không load được
                    e.currentTarget.src =
                      "https://via.placeholder.com/600x338/e5e7eb/6b7280?text=" +
                      encodeURIComponent(site.TenDiaDiem);
                  }}
                />
              </div>
              {/* Overlay gradient dưới đáy ảnh để tăng độ tương phản chữ */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />
              {/* Nội dung chồng lên ảnh - giảm padding-bottom để text thấp hơn */}
              <div className="absolute bottom-0 left-0 right-0 px-4 pt-4 pb-2 z-10">
                <Title size="small" className="mb-1 text-white font-bold drop-shadow">
                  {site.TenDiaDiem}
                </Title>
                <div className="flex items-start gap-2 text-white">
                  <Icon className="text-white mt-0.5 flex-shrink-0" icon="zi-location-solid" size={14} />
                  <span className="text-white/90 text-sm leading-relaxed line-clamp-2 drop-shadow">
                    {site.DiaChi}
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  );
}
