import data from "@/components/mock/tocongnghe.json";

// Kiểu dữ liệu cho một mục Tổ công nghệ số cộng đồng
interface ToCongNgheItem {
  phong: string;
  linh_vuc: string;
  noi_dung: string[];
  so_dien_thoai?: string;
  dia_chi?: string;
}

/**
 * Trang danh sách Tổ công nghệ số cộng đồng.
 * - Đọc dữ liệu từ src/components/mock/tocongnghe.json
 * - Hiển thị mỗi đơn vị dưới dạng thẻ: Phòng (tiêu đề), lĩnh vực (chip), các nội dung hỗ trợ (bullet)
 *   kèm thông tin liên hệ: số điện thoại (nút gọi), địa chỉ (icon vị trí)
 */
function ToCongNgheSoList() {
  const items = (data as ToCongNgheItem[]) || [];

  /**
   * Gọi nhanh tới số điện thoại.
   */
  function handleCall(phone?: string) {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  }

  /**
   * Mở Google Maps theo địa chỉ văn bản (ưu tiên app, fallback trình duyệt).
   */
  function openMapByAddress(address?: string) {
    if (!address) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-page p-4">
      {/* Tiêu đề trang */}
      <h1 className="text-lg font-semibold mb-3">Tổ công nghệ số cộng đồng</h1>

      {/* Gợi ý mô tả ngắn */}
      <p className="text-sm text-gray-600 mb-4">
        Danh sách các đơn vị hỗ trợ chuyển đổi số, thương mại điện tử, an toàn thông tin và các dịch vụ công.
      </p>

      {/* Danh sách thẻ */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            {/* Header: Phòng + Lĩnh vực */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-medium text-gray-900">{item.phong}</div>
                {item.linh_vuc && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-[12px] rounded-full bg-blue-50 text-primary">
                    {item.linh_vuc}
                  </span>
                )}
              </div>

              {/* Nút gọi nhanh nổi bật (nếu có số) */}
              {item.so_dien_thoai && (
                <button
                  type="button"
                  onClick={() => handleCall(item.so_dien_thoai)}
                  className="shrink-0 w-10 h-10 rounded-full bg-green-50 hover:bg-green-100 flex items-center justify-center"
                  aria-label="Gọi nhanh"
                  title="Gọi nhanh"
                >
                  {/* Icon gọi */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-600">
                    <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C11.3 22 2 12.7 2 1a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Nội dung hỗ trợ (bullet) */}
            {Array.isArray(item.noi_dung) && item.noi_dung.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {item.noi_dung.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-gray-700">
                    {/* Dấu chấm bullet */}
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="leading-snug">{c}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Liên hệ & Địa chỉ */}
            <div className="mt-3 space-y-2">
              {item.so_dien_thoai && (
                <div className="flex items-center gap-2 text-[13px] text-gray-800">
                  {/* Icon điện thoại */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-green-600 shrink-0"
                  >
                    <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C11.3 22 2 12.7 2 1a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" />
                  </svg>
                  <a href={`tel:${item.so_dien_thoai}`} className="text-primary">
                    {item.so_dien_thoai}
                  </a>
                </div>
              )}

              {item.dia_chi && (
                <button
                  type="button"
                  onClick={() => openMapByAddress(item.dia_chi)}
                  className="flex items-start gap-2 text-[13px] text-gray-800 hover:text-primary"
                >
                  {/* Icon vị trí */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-primary mt-0.5 shrink-0"
                  >
                    <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5.5z" />
                  </svg>
                  <span className="text-left leading-snug">{item.dia_chi}</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Trạng thái rỗng */}
        {items.length === 0 && (
          <div className="text-center text-sm text-disabled py-10">
            Chưa có dữ liệu tổ công nghệ số
          </div>
        )}
      </div>
    </div>
  );
}

export default ToCongNgheSoList;