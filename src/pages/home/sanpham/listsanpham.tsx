import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import categories from "@/components/mock/danhmucsanpham.json";
import products from "@/components/mock/sanpham.json";
import contacts from "@/components/mock/lienhedathang.json";

// Kiểu dữ liệu
interface Category {
  id: number;
  name: string;
  image: string;
}
interface ProductItem {
  id: number;
  ten: string;
  hinhAnh: string;
  gia: string; // số ở dạng chuỗi
  giamKhuyenMai: string; // % dưới dạng chuỗi
  idDanhMuc: number;
}
interface ContactItem {
  id: number;
  sanPhamId: number;
  tenCuaHang: string;
  soDienThoai: string;
  diaChi: string;
  gioMoCua?: string | null;
  moTa?: string | null;
}

/**
 * Trang danh sách sản phẩm đặc sản Tây Ninh.
 * - Có thanh tìm kiếm, hàng chips danh mục (Tất cả + danh mục), lưới thẻ 2 cột.
 * - Mỗi thẻ hiển thị: ảnh, tên, giá sau khuyến mãi (màu xanh), giá gốc gạch ngang + % giảm.
 * - Nút "Liên hệ đặt hàng" mở popup, lấy dữ liệu từ lienhedathang.json theo sanPhamId.
 */
export default function ListSanPhamPage() {
  const [keyword, setKeyword] = useState("");
  const [activeCate, setActiveCate] = useState<number>(0); // 0 = Tất cả
  const [openContactFor, setOpenContactFor] = useState<number | null>(null); // product id
  const navigate = useNavigate(); // Điều hướng sang trang chi tiết

  const cateList = categories as Category[];
  const productList = (products as ProductItem[]).sort((a, b) => a.id - b.id);

  /**
   * Định dạng số tiền theo VND.
   */
  function formatVND(n: number) {
    return n.toLocaleString("vi-VN") + " VND";
  }

  /**
   * Tính giá đã giảm dựa trên giá gốc và % khuyến mãi.
   */
  function getDiscountedPrice(gia: string, giamKhuyenMai: string) {
    const base = Number(gia || 0);
    const percent = Number(giamKhuyenMai || 0);
    const discounted = Math.round(base * (1 - percent / 100));
    return { base, percent, discounted };
  }

  /**
   * Lọc sản phẩm theo từ khoá và danh mục.
   */
  const items = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return productList.filter((p) => {
      const byCate = activeCate === 0 || p.idDanhMuc === activeCate;
      const byKw = !kw || p.ten.toLowerCase().includes(kw);
      return byCate && byKw;
    });
  }, [keyword, activeCate, productList]);

  /**
   * Lấy danh sách liên hệ đặt hàng cho sản phẩm theo id.
   */
  function getContactsByProductId(productId: number): ContactItem[] {
    return (contacts as ContactItem[]).filter((c) => c.sanPhamId === productId);
  }

  /**
   * Gọi nhanh số điện thoại.
   */
  function handleCall(phone?: string) {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  }

  const activeContacts = openContactFor ? getContactsByProductId(openContactFor) : [];

  return (
    <div className="h-screen overflow-y-auto bg-page">
      {/* Header giả lập khoảng trắng top */}
      <div className="h-2" />

      <div className="px-4">
        {/* Thanh tìm kiếm */}
        <div className="relative">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Bạn muốn mua gì..."
            className="w-full rounded-full bg-white h-10 pl-10 pr-4 text-sm placeholder:text-gray-400 shadow-sm focus:outline-none"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
          >
            <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm11 18.59L18.42 18a10 10 0 1 0-1.41 1.41L19.59 22 21 20.59z" />
          </svg>
        </div>

        {/* Chips danh mục */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {cateList.map((c) => {
            const active = activeCate === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCate(c.id)}
                className={`flex items-center gap-2 shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active ? "bg-green-500/90 text-white" : "bg-white text-primary shadow" 
                }`}
              >
                <span className="w-6 h-6 rounded-full overflow-hidden bg-white/80 ring-1 ring-white/50">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                </span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* Lưới sản phẩm */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {items.map((p) => {
            const { base, percent, discounted } = getDiscountedPrice(p.gia, p.giamKhuyenMai);
            return (
              <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                {/* Ảnh sản phẩm - click để vào chi tiết */}
                <div
                  className="aspect-[4/3] w-full bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/sanpham/${p.id}`)}
                >
                  <img src={p.hinhAnh} alt={p.ten} className="w-full h-full object-cover" />
                </div>

                <div className="p-3">
                  {/* Tên sản phẩm - click để vào chi tiết */}
                  <div
                    className="text-[13px] text-gray-900 line-clamp-2 min-h-[36px] cursor-pointer"
                    onClick={() => navigate(`/sanpham/${p.id}`)}
                  >
                    {p.ten}
                  </div>

                  {/* Giá */}
                  <div className="mt-1">
                    <div className="text-green-600 font-semibold">{formatVND(discounted)}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <span className="line-through">{formatVND(base)}</span>
                      {percent > 0 && <span className="text-red-500">-{percent}%</span>}
                    </div>
                  </div>

                  {/* Nút liên hệ đặt hàng */}
                  <button
                    type="button"
                    onClick={() => setOpenContactFor(p.id)}
                    className="mt-2 w-full rounded-full bg-green-100 text-green-700 text-sm py-1.5 font-medium active:bg-green-200"
                  >
                    Liên hệ đặt hàng
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trạng thái rỗng */}
        {items.length === 0 && (
          <div className="text-center text-sm text-disabled py-10">Không tìm thấy sản phẩm phù hợp</div>
        )}
      </div>

      {/* Popup liên hệ đặt hàng */}
      {openContactFor !== null && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenContactFor(null)} />

          {/* Sheet */}
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-lg max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="px-4 pt-3 pb-2 border-b border-gray-100 flex items-center justify-between">
              <div className="font-medium">Liên hệ đặt hàng</div>
              <button
                aria-label="Đóng"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                onClick={() => setOpenContactFor(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29 10.59 10.6l6.3-6.3z" />
                </svg>
              </button>
            </div>

            {/* Danh sách liên hệ */}
            <div className="p-4 space-y-3 max-h-[60vh] overflow-auto">
              {activeContacts.length === 0 && (
                <div className="text-center text-sm text-gray-500">Chưa có thông tin liên hệ cho sản phẩm này</div>
              )}

              {activeContacts.map((c) => (
                <div key={c.id} className="border border-gray-100 rounded-lg p-3 shadow-sm">
                  <div className="font-medium text-gray-900">{c.tenCuaHang}</div>

                  {/* SĐT */}
                  <div className="mt-1 flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2 text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                        <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C11.3 22 2 12.7 2 1a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" />
                      </svg>
                      <a href={`tel:${c.soDienThoai}`} className="text-primary">{c.soDienThoai}</a>
                    </div>

                    <button
                      onClick={() => handleCall(c.soDienThoai)}
                      className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium"
                    >
                      Gọi
                    </button>
                  </div>

                  {/* Địa chỉ */}
                  <div className="mt-1 flex items-start gap-2 text-[13px] text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary mt-0.5">
                      <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5.5z" />
                    </svg>
                    <span className="leading-snug">{c.diaChi}</span>
                  </div>

                  {/* Mô tả */}
                  {c.moTa && <div className="mt-1 text-[13px] text-gray-600">{c.moTa}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}