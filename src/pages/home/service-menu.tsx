import hospital from "@/static/services/hospital.svg";
import lung from "@/static/services/lung.svg";
import drug from "@/static/services/drug.svg";
import invoice from "@/static/services/invoice.svg";
import all from "@/static/services/all.svg";
import ServiceItem from "@/components/items/service";
import bocso from "@/static/icon/bocso.png";
import checkin from "@/static/icon/checkin.png";
import hotel from "@/static/icon/hotel.png";
import hotline from "@/static/icon/hotline.png";
import lichsuvanhoa from "@/static/icon/lichsuvanhoa.png";
import news from "@/static/icon/news.png";
import thutuc from "@/static/icon/thutuc.png";
import tracuuhs from "@/static/icon/tracuuhs.png";
import kiennghi from "@/static/icon/recommend.png";
import sanpham from "@/static/icon/sanpham.png";

export default function ServiceMenu() {
  return (
    <div className="bg-white bg-opacity-80 grid grid-cols-3 gap-4 p-4 rounded-xl drop-shadow-xl">
      <ServiceItem to="/" icon={hotel} label="Nhà hàng - Khách sạn" />
      <ServiceItem to="/categories" icon={lichsuvanhoa} label="Lịch sử - Văn hoá" />
      {/* <ServiceItem icon={drug} label="Toa thuốc" /> */}
      <ServiceItem to="/invoices" icon={kiennghi} label="Kiến nghị - Phản ánh" />
      <ServiceItem to="/services" icon={bocso} label="Bốc số từ xa" />
      <ServiceItem to="https://dichvucong.gov.vn/p/home/dvc-tra-cuu-ho-so.html" icon={tracuuhs} label="Tra cứu hồ sơ" />
      <ServiceItem to="https://thutuc.dichvucong.gov.vn/p/home/dvc-tthc-trang-chu.html" icon={thutuc} label="Thủ tục hành chính" />
      <ServiceItem to="/invoices" icon={sanpham} label="Sản phẩm địa phương" />
      <ServiceItem to="/services" icon={news} label="Thông tin từ chính quyền" />
      <ServiceItem to="https://dichvucong.gov.vn/p/home/dvc-tra-cuu-ho-so.html" icon={hotline} label="Đường dây nóng" />
    </div>
  );
}
