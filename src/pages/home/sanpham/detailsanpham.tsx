import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import products from "@/components/mock/sanpham.json";
import contacts from "@/components/mock/lienhedathang.json";
import { openShareSheet } from "zmp-sdk/apis";

// Kiểu dữ liệu sản phẩm
interface ProductItem {
  id: number;
  ten: string;
  hinhAnh: string;
  gia: string; // số ở dạng chuỗi
  giamKhuyenMai: string; // % dưới dạng chuỗi
  idDanhMuc: number;
  moTa?: string | null;
}

// Kiểu dữ liệu liên hệ
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
 * Trang chi tiết sản phẩm theo ảnh mẫu.
 * - Hiển thị ảnh lớn, tên, giá sau giảm (màu xanh), giá gốc gạch + % giảm.
 * - Có thanh chia sẻ (giả lập) và phần "Mô tả sản phẩm".
 * - Nút cố định cuối trang: "Liên hệ đặt hàng" mở popup danh sách liên hệ theo sản phẩm.
 */
export default function DetailSanPhamPage() {
  const { id } = useParams();
  const productId = Number(id);

  // Lấy sản phẩm theo id param
  const item = useMemo(() => {
    return (products as ProductItem[]).find((p) => p.id === productId) || null;
  }, [productId]);

  const [openContact, setOpenContact] = useState(false);

  // Định dạng tiền VND
  function formatVND(n: number) {
    return n.toLocaleString("vi-VN") + " VND";
  }

  // Tính giá đã giảm
  function getDiscountedPrice(gia: string, giamKhuyenMai: string) {
    const base = Number(gia || 0);
    const percent = Number(giamKhuyenMai || 0);
    const discounted = Math.round(base * (1 - percent / 100));
    return { base, percent, discounted };
  }

  // Lấy danh sách liên hệ theo sản phẩm
  function getContactsByProductId(productId: number): ContactItem[] {
    return (contacts as ContactItem[]).filter((c) => c.sanPhamId === productId);
  }

  // Gọi nhanh
  function handleCall(phone?: string) {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  }

  /**
   * Mở ShareSheet của Zalo Mini App để chia sẻ đường dẫn đến trang chi tiết sản phẩm.
   * - type: "zmp" chia sẻ trong Mini App với title, thumbnail, path, description.
   * - Fallback Web Share API khi chạy trên web (trình duyệt) để đảm bảo trải nghiệm.
   */
  async function handleShare() {
    // Bảo vệ: nếu không có dữ liệu sản phẩm thì không thực hiện chia sẻ
    if (!item) return;

    // Tính lại giá giảm để dùng trong mô tả, tránh phụ thuộc biến bên ngoài
    const { discounted } = getDiscountedPrice(item.gia, item.giamKhuyenMai);

    try {
      await openShareSheet({
        type: "zmp",
        data: {
          title: item.ten,
          thumbnail: item.hinhAnh,
          path: `/sanpham/${productId}`,
          description: item.moTa || `${formatVND(discounted)} - ${item.ten}`,
        },
      });
    } catch (err) {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        try {
          await (navigator as any).share({
            title: item.ten,
            text: item.moTa || item.ten,
            url: window.location.href,
          });
        } catch {}
      }
    }
  }

  if (!item) {
    return (
      <div className="h-screen bg-page flex items-center justify-center text-sm text-gray-500">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  const { base, percent, discounted } = getDiscountedPrice(
    item.gia,
    item.giamKhuyenMai
  );
  const contactList = getContactsByProductId(productId);

  return (
    <div className="h-screen overflow-y-auto bg-page">
      {/* Ảnh sản phẩm */}
      <div className="bg-white">
        <div className="aspect-[4/3] w-full bg-gray-100">
          <img src={item.hinhAnh} alt={item.ten} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Nội dung */}
      <div className="px-4 pt-3 pb-28">
        {/* Tên + icon giỏ */}
        <div className="flex items-start justify-between gap-3">
          <div className="text-base font-semibold text-gray-900 leading-snug">
            {item.ten}
          </div>
          {/* <button
            aria-label="Giỏ hàng"
            className="mt-0.5 w-9 h-9 rounded-full flex items-center justify-center text-gray-500 bg-white shadow-sm border border-gray-100"
          >
            Cart icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14.26l.03-.12L7.9 12h8.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49-1.73-.99L16.35 10H8.53l-.1-.5L6.16 2H2v2h2l3.6 7.59-1.35 2.45C5.52 14.37 6.2 15 7 15h12v-2H7.42l-.26-.74z" />
            </svg>
          </button> */}
        </div>

        {/* Giá */}
        <div className="mt-2">
          <div className="text-green-600 font-semibold text-lg">{formatVND(discounted)}</div>
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span className="line-through">{formatVND(base)}</span>
            {percent > 0 && <span className="text-red-500">-{percent}%</span>}
          </div>
        </div>

        {/* Thanh chia sẻ */}
        <button
          type="button"
          onClick={handleShare}
          className="mt-3 w-full flex items-center justify-between rounded-lg bg-green-50 text-green-700 px-3 py-2 text-sm"
        >
          <span className="flex items-center gap-2">
            {/* Share icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.02-4.11c.54.5 1.25.81 2.07.81 1.66 0 3-1.34 3-3s-1.34-3-3 1.34-3 3c0 .24.04.47.09.7L8.91 8.81C8.37 8.31 7.66 8 6.84 8 5.18 8 3.84 9.34 3.84 11s1.34 3 3 3c.82 0 1.53-.31 2.07-.81l7.13 4.17c-.05.2-.08.41-.08.64 0 1.62 1.31 2.93 2.93 2.93s2.93-1.31 2.93-2.93S19.62 16.08 18 16.08z" />
            </svg>
            Chia sẻ ngay cho bạn bè
          </span>
          <span className="text-lg">›</span>
        </button>

        {/* Mô tả sản phẩm */}
        <div className="mt-5">
          <div className="font-medium text-gray-900">Mô tả sản phẩm</div>
          <p className="mt-1 text-[13px] leading-relaxed text-gray-700">
            {item.moTa || "Đang cập nhật mô tả."}
          </p>
        </div>
      </div>

      {/* Nút cố định Liên hệ đặt hàng */}
      <div className="fixed inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white via-white/90 to-white/0">
        <button
          type="button"
          onClick={() => setOpenContact(true)}
          className="w-full rounded-full bg-green-600 text-white py-3 font-medium shadow-lg active:bg-green-700"
        >
          Liên hệ đặt hàng
        </button>
      </div>

      {/* Popup liên hệ đặt hàng */}
      {openContact && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenContact(false)} />

          {/* Sheet */}
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-lg max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="px-4 pt-3 pb-2 border-b border-gray-100 flex items-center justify-between">
              <div className="font-medium">Liên hệ đặt hàng</div>
              <button
                aria-label="Đóng"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                onClick={() => setOpenContact(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29 10.59 10.6l6.3-6.3z" />
                </svg>
              </button>
            </div>

            {/* Danh sách liên hệ */}
            <div className="p-4 space-y-3 max-h-[60vh] overflow-auto">
              {contactList.length === 0 && (
                <div className="text-center text-sm text-gray-500">Chưa có thông tin liên hệ cho sản phẩm này</div>
              )}

              {contactList.map((c) => (
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