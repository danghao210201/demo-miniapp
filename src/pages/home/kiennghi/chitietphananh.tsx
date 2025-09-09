import { useMemo } from "react";
import phananh from "@/components/mock/kiennghi.json";
import TransitionLink from "@/components/transition-link";

/**
 * Trang Chi tiết phản ánh
 * - Hiển thị chi tiết phản ánh theo id
 * - Nếu không tìm thấy thì hiển thị trạng thái rỗng + nút quay lại
 * - Fix không scroll: dùng pattern layout chung của dự án
 */
export default function ChiTietPhanAnh() {
  /**
   * Lấy id từ URL (query string)
   */
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");

  /**
   * Tìm dữ liệu phản ánh theo id
   */
  const phanAnhData = useMemo(() => {
    if (!id) return null;
    return phananh.find((item) => item.id === id) || null;
  }, [id]);

  /**
   * Định dạng ngày giờ
   */
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    }`;
  };

  if (!phanAnhData) {
    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-lg font-bold mb-2">Không tìm thấy phản ánh</h2>
          <p className="text-gray-500 text-center mb-4">
            Phản ánh bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <TransitionLink
            to="/kiennghi"
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Quay lại
          </TransitionLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-h-0">
      {/* Nội dung chính */}
      <div className="flex-1 overflow-y-auto">
        {/* Hình ảnh */}
        {phanAnhData.hinhAnh && (
          <div className="w-full h-64 bg-gray-200">
            <img
              src={phanAnhData.hinhAnh}
              alt="Hình ảnh phản ánh"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Chi tiết */}
        <div className="bg-white p-4">
          {/* Thông tin người gửi */}
          <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              {/* Icon user (inline SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 text-blue-600"
              >
                <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{phanAnhData.hoTen}</div>
              <div className="text-sm text-gray-500">
                {formatDateTime(phanAnhData.thoiGianGui)}
              </div>
            </div>
          </div>

          {/* Nội dung phản ánh */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Nội dung phản ánh</h3>
            <p className="text-gray-700 leading-6 whitespace-pre-wrap">
              {phanAnhData.noiDung}
            </p>
          </div>

          {/* Phản hồi */}
          {phanAnhData.phanHoi && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  {/* Icon check (inline SVG) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-green-600"
                  >
                    <path d="M9 16.17l-3.88-3.88a1 1 0 0 1 1.41-1.41L9 13.34l8.47-8.47a1 1 0 0 1 1.41 1.41L9 16.17z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-green-800">
                    Phản hồi từ cơ quan chức năng
                  </div>
                  <div className="text-sm text-green-600">
                    {formatDateTime(phanAnhData.phanHoi.thoiGianPhanHoi)}
                  </div>
                </div>
              </div>
              <p className="text-green-800 leading-6 whitespace-pre-wrap pl-11">
                {phanAnhData.phanHoi.noiDung}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
