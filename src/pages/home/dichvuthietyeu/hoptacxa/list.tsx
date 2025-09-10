import { useMemo, useState } from "react";
import SearchInput from "@/components/form/search";

/**
 * Trang Danh sách Doanh nghiệp/Hợp tác xã - Phường Ninh Thạnh
 * - Có thanh tìm kiếm ở trên cùng
 * - Bên dưới là danh sách thẻ hiển thị: Tên, Mã số thuế, Số điện thoại, Địa chỉ, Vị trí (nút Vị trí)
 * - Hỗ trợ lọc theo từ khóa: tên, mã số thuế, số điện thoại, địa chỉ
 */
export default function HTXListPage() {
  // Từ khóa tìm kiếm
  const [keyword, setKeyword] = useState("");

  // Dữ liệu mẫu các Doanh nghiệp/HTX trên địa bàn Phường Ninh Thạnh
  const DATA: DoanhNghiepHTX[] = [
    {
      id: "htx-01",
      ten: "HTX Nông nghiệp Ninh Thạnh 1",
      maSoThue: "3901234567",
      soDienThoai: "0276 3 123 456",
      diaChi: "Kp. Ninh Trung, P. Ninh Thạnh, TP. Tây Ninh",
      viTri: { lat: 11.31685, lng: 106.12824 },
    },
    {
      id: "htx-02",
      ten: "HTX Dịch vụ Tổng hợp Ninh Thạnh",
      maSoThue: "3902345678",
      soDienThoai: "0901 234 567",
      diaChi: "Kp. Ninh Đức, P. Ninh Thạnh, TP. Tây Ninh",
      viTri: { lat: 11.31192, lng: 106.13491 },
    },
    {
      id: "htx-03",
      ten: "Doanh nghiệp Tư nhân Ninh Thạnh Xanh",
      maSoThue: "3903456789",
      soDienThoai: "0276 3 222 333",
      diaChi: "Đường 30/4, P. Ninh Thạnh, TP. Tây Ninh",
      viTri: { lat: 11.3195, lng: 106.1402 },
    },
    {
      id: "htx-04",
      ten: "HTX Sản xuất - Thương mại Ninh Thạnh",
      maSoThue: "3904567890",
      soDienThoai: "0987 654 321",
      diaChi: "Kp. Ninh Mỹ, P. Ninh Thạnh, TP. Tây Ninh",
      viTri: { lat: 11.3076, lng: 106.1218 },
    },
    {
      id: "htx-05",
      ten: "Công ty TNHH Nông sản Ninh Thạnh",
      maSoThue: "3905678901",
      soDienThoai: "0276 3 444 555",
      diaChi: "QL22B, P. Ninh Thạnh, TP. Tây Ninh",
      viTri: { lat: 11.3241, lng: 106.1359 },
    },
    {
      id: "htx-06",
      ten: "HTX Tiểu thủ công nghiệp Ninh Thạnh",
      maSoThue: "3906789012",
      soDienThoai: "0912 345 678",
      diaChi: "Kp. Ninh Lộc, P. Ninh Thạnh, TP. Tây Ninh",
      viTri: { lat: 11.3134, lng: 106.1263 },
    },
  ];

  /**
   * Lọc danh sách theo từ khóa (không phân biệt hoa/thường).
   * Ưu tiên lọc theo: Tên, Mã số thuế, Số điện thoại, Địa chỉ.
   */
  const items = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return DATA;
    return DATA.filter((r) => {
      const name = (r.ten || "").toLowerCase();
      const tax = (r.maSoThue || "").toLowerCase();
      const phone = (r.soDienThoai || "").toLowerCase();
      const addr = (r.diaChi || "").toLowerCase();
      return (
        name.includes(kw) || tax.includes(kw) || phone.includes(kw) || addr.includes(kw)
      );
    });
  }, [keyword]);

  /**
   * Gọi điện nhanh tới số điện thoại cung cấp.
   */
  function handleCall(soDienThoai?: string) {
    if (!soDienThoai) return;
    window.location.href = `tel:${soDienThoai}`;
  }

  /**
   * Mở Vị trí Google Maps theo toạ độ (nếu có), ưu tiên app; fallback trình duyệt.
   */
  function openDirection(pos?: { lat: number; lng: number }, label?: string) {
    if (!pos) return;
    const url = `https://www.google.com/maps?q=${pos.lat},${pos.lng}${label ? ` (${encodeURIComponent(label)})` : ""}`;
    window.open(url, "_blank");
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white min-h-0">
      {/* Thanh tìm kiếm */}
      <div className="p-4 pb-0">
        <SearchInput
          className="m-0"
          value={keyword}
          onChange={(e) => setKeyword(e.currentTarget.value)}
          placeholder="Tìm HTX/doanh nghiệp, mã số thuế, địa chỉ, số điện thoại..."
        />
      </div>

      {/* Danh sách - vùng cuộn chính */}
      <div className="flex-1 p-4 pt-4 space-y-4 overflow-y-auto pb-24 bg-gray-50">
        {items.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden"
          >
            {/* Nội dung thẻ */}
            <div className="p-3.5">
              {/* Tên đơn vị */}
              <h3 className="text-[15px] font-semibold leading-snug">{r.ten}</h3>

              {/* Mã số thuế */}
              {r.maSoThue && (
                <div className="mt-2 flex items-center gap-2 text-[12px] text-gray-700">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                    MST: {r.maSoThue}
                  </span>
                </div>
              )}

              {/* Địa chỉ */}
              {r.diaChi && (
                <div className="mt-2 flex items-start gap-2 text-[13px] text-gray-700">
                  {/* Icon vị trí (inline SVG) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-primary shrink-0 mt-0.5"
                  >
                    <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5.5z" />
                  </svg>
                  <span className="leading-snug">{r.diaChi}</span>
                </div>
              )}

              {/* Số điện thoại */}
              {r.soDienThoai && (
                <div className="mt-1.5 flex items-start gap-2 text-[13px] text-gray-700">
                  {/* Icon điện thoại (inline SVG) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-green-600 shrink-0 mt-0.5"
                  >
                    <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C11.3 22 2 12.7 2 1a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" />
                  </svg>
                  <a href={`tel:${r.soDienThoai}`} className="leading-snug">
                    {r.soDienThoai}
                  </a>
                </div>
              )}

              {/* Hàng nút hành động */}
              <div className="mt-3 flex items-center gap-2">
                {r.soDienThoai && (
                  <button
                    onClick={() => handleCall(r.soDienThoai)}
                    className="px-3 py-1.5 text-[13px] rounded-lg bg-green-50 text-green-700 border border-green-200 active:bg-green-100"
                  >
                    Gọi
                  </button>
                )}
                {r.viTri && (
                  <button
                    onClick={() => openDirection(r.viTri, r.ten)}
                    className="px-3 py-1.5 text-[13px] rounded-lg bg-blue-50 text-blue-700 border border-blue-200 active:bg-blue-100"
                  >
                    Vị trí
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Trạng thái rỗng */}
        {items.length === 0 && (
          <div className="text-center text-sm text-disabled py-8">
            Không tìm thấy đơn vị phù hợp
          </div>
        )}
      </div>
    </div>
  );
}

// Kiểu dữ liệu cho một đơn vị Doanh nghiệp/Hợp tác xã
interface DoanhNghiepHTX {
  id: string;
  ten: string;
  maSoThue: string;
  soDienThoai?: string;
  diaChi?: string;
  viTri?: { lat: number; lng: number };
}