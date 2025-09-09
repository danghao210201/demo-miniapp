import { useMemo, useState } from "react";
import phananh from "@/components/mock/kiennghi.json";
import TransitionLink from "@/components/transition-link";
import { Box, Button, Icon, Text } from "zmp-ui";

/**
 * Trang Danh sách phản ánh
 * - Hiển thị thanh tìm kiếm ở trên cùng
 * - Bên dưới là danh sách phản ánh dạng thẻ (card) với ảnh cover, nội dung rút gọn, thời gian gửi
 * - Hỗ trợ lọc theo từ khóa theo họ tên, số điện thoại và nội dung
 * - Fix không scroll: dùng pattern layout chung của dự án
 *   + Wrapper: flex-1 flex-col overflow-hidden (giữ 1 vùng cuộn duy nhất)
 *   + List container: flex-1 overflow-y-auto (vùng cuộn chính)
 */
export default function DanhSachPhanAnh() {
  const [keyword, setKeyword] = useState("");

  /**
   * Tạo danh sách đã lọc theo từ khóa.
   * Ưu tiên lọc theo: Họ tên, số điện thoại, nội dung.
   */
  const items = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return phananh.map((r, i) => ({ ...r, _index: i } as any));
    return phananh
      .map((r, i) => ({ ...r, _index: i } as any))
      .filter((r: any) => {
        const name = (r.hoTen || "").toLowerCase();
        const phone = (r.soDienThoai || "").toLowerCase();
        const content = (r.noiDung || "").toLowerCase();
        return name.includes(kw) || phone.includes(kw) || content.includes(kw);
      });
  }, [keyword]);

  /**
   * Định dạng ngày giờ
   */
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
      }`;
  };

  /**
   * Rút gọn nội dung
   */
  const truncateContent = (content: string, maxLength: number = 80) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  /**
   * Lấy ảnh cover hoặc placeholder
   */
  const getCover = (src?: string) => {
    return (
      src ||
      "https://via.placeholder.com/600x338/e5e7eb/6b7280?text=Phản+ánh+hiện+trường"
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-h-0">
      <Box className="p-4 bg-white">
        <TransitionLink
          to="/kiennghi/guiphananh"
        >
          <Text className="text-gray-600 text-sm">Bạn có sự việc cần phản ánh?</Text>
        </TransitionLink>

      </Box>
      {/* Action buttons */}
      <div className="flex p-4 bg-white border-b border-gray-200 space-x-2">
        <TransitionLink
          to="/kiennghi/guiphananh"
          className="flex-1 flex items-center justify-center bg-blue-600 text-white border-none rounded-lg px-3 py-2"
        >
          <Icon icon="zi-share" className="mr-2" size={15} />
          <Text className="text-white">Gửi phản ánh</Text>
        </TransitionLink>

        <TransitionLink
          to="/kiennghi/phananhdagui"
          className="flex-1 flex items-center justify-center bg-blue-600 text-white border-none rounded-lg px-3 py-2"
        >
          <Icon icon="zi-clock-1" className="mr-2" size={15} />
          <Text className="text-white">Đã gửi</Text>
        </TransitionLink>
      </div>
      {/* Danh sách phản ánh - vùng cuộn chính */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
        {items.map((r: any, idx) => (
          <TransitionLink
            key={idx}
            to={`/kiennghi/chitietphananh?id=${r.id}`}
            className="block bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden"
          >
            {/* Ảnh cover */}
            <div className="relative w-full aspect-[16/9]">
              <img
                src={getCover(r.hinhAnh)}
                alt="Phản ánh"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/600x338/e5e7eb/6b7280?text=No+Image";
                }}
              />
            </div>

            {/* Nội dung */}
            <div className="p-3.5">
              <h3 className="text-[15px] font-medium leading-snug">
                {truncateContent(r.noiDung, 100)}
              </h3>

              {/* Thời gian */}
              <div className="mt-2 flex items-center gap-2 text-[13px] text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-4 h-4 text-primary shrink-0"
                >
                  <path d="M12 7a1 1 0 0 1 1 1v3.586l2.707 2.707a1 1 0 0 1-1.414 1.414L11 12.414V8a1 1 0 0 1 1-1z" />
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
                  />
                </svg>
                <span>{formatDateTime(r.thoiGianGui)}</span>
              </div>
            </div>
          </TransitionLink>
        ))}

        {/* Trạng thái rỗng */}
        {items.length === 0 && (
          <div className="text-center text-sm text-disabled py-8">
            Không tìm thấy phản ánh nào
          </div>
        )}
      </div>
    </div>
  );
}
