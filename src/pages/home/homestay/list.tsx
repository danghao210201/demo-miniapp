import { useMemo, useState } from "react";
import SearchInput from "@/components/form/search";
import data from "@/components/mock/homestay.json";
import TransitionLink from "@/components/transition-link";

/**
 * Trang Danh sách homestay
 * - Hiển thị thanh tìm kiếm ở trên cùng
 * - Bên dưới là danh sách thẻ với ảnh cover, tiêu đề, địa chỉ và số điện thoại
 * - Hỗ trợ lọc theo từ khóa theo tên, địa chỉ và số điện thoại
 * - Fix không scroll: dùng pattern layout chung của dự án
 *   + Wrapper: flex-1 flex-col overflow-hidden (giữ 1 vùng cuộn duy nhất)
 *   + List container: flex-1 overflow-y-auto (vùng cuộn chính)
 */
export default function HomestayListPage() {
  // Từ khóa tìm kiếm
  const [keyword, setKeyword] = useState("");

  /**
   * Tạo danh sách đã lọc theo từ khóa.
   * Ưu tiên lọc theo: Tên địa điểm, Địa chỉ, Số điện thoại.
   */
  const items = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return data.map((r, i) => ({ ...r, _index: i } as any));
    return data
      .map((r, i) => ({ ...r, _index: i } as any))
      .filter((r: any) => {
        const name = (r.ten || "").toLowerCase();
        const addr = (r.diaChi || "").toLowerCase();
        const phone = (r.soDienThoai || "").toLowerCase();
        return name.includes(kw) || addr.includes(kw) || phone.includes(kw);
      });
  }, [keyword]);

  /**
   * Trả về URL ảnh nếu có; nếu không có thì trả placeholder.
   */
  const getCover = (img?: string) => {
    return (
      img ||
      "https://via.placeholder.com/600x338/e5e7eb/6b7280?text=No+Image"
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white min-h-0">
      {/* Thanh tìm kiếm */}
      <div className="p-4 pb-0">
        <SearchInput
          className="m-0"
          value={keyword}
          onChange={(e) => setKeyword(e.currentTarget.value)}
          placeholder="Tìm homestay, địa chỉ, số điện thoại..."
        />
      </div>

      {/* Danh sách homestay - vùng cuộn chính */}
      <div className="flex-1 p-4 pt-4 space-y-4 overflow-y-auto pb-24">
        {items.map((r: any, idx) => (
          <TransitionLink
            key={idx}
            to={`/homestay/${r._index}`}
            className="block bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden"
          >
            {/* Ảnh cover 16:9 */}
            <div className="relative w-full aspect-[16/9]">
              <img
                src={getCover(r.hinhAnh)}
                alt={r.ten}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/600x338/e5e7eb/6b7280?text=No+Image";
                }}
              />
            </div>

            {/* Nội dung */}
            <div className="p-3.5">
              <h3 className="text-[15px] font-semibold leading-snug">
                {r.ten}
              </h3>

              {/* Địa chỉ */}
              {r.diaChi && (
                <div className="mt-2 flex items-start gap-2 text-[13px] text-gray-700">
                  {/* Icon vị trí (inline SVG để tránh thêm file mới) */}
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
            </div>
          </TransitionLink>
        ))}

        {/* Trạng thái rỗng */}
        {items.length === 0 && (
          <div className="text-center text-sm text-disabled py-8">
            Không tìm thấy homestay phù hợp
          </div>
        )}
      </div>
    </div>
  );
}