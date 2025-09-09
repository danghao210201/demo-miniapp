import React, { FC, useState, useEffect } from "react";
import { Box, Page, Text, Button, Icon, Header } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import phananh from "@/components/mock/kiennghi.json";

interface PhanAnh {
  id: string;
  hoTen: string;
  soDienThoai: string;
  thoiGianGui: string;
  noiDung: string;
  hinhAnh?: string;
  phanHoi?: {
    noiDung: string;
    thoiGianPhanHoi: string;
  };
}

export const DanhSachPhanAnh: FC = () => {
  const navigate = useNavigate();
  const [danhSachPhanAnh, setDanhSachPhanAnh] = useState<PhanAnh[]>([]);

  useEffect(() => {
    // Lấy dữ liệu từ mock data
    setDanhSachPhanAnh(phananh);
  }, []);

  // Định dạng ngày giờ
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
  };

  // Rút gọn nội dung
  const truncateContent = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Xử lý khi nhấn vào xem chi tiết
  const handleViewDetail = (id: string) => {
    navigate(`/kiennghi/chitietphananh?id=${id}`);
  };

  // Xử lý khi nhấn vào nút gửi phản ánh
  const handleSendFeedback = () => {
    navigate("/kiennghi/guiphananh");
  };

  // Xử lý khi nhấn vào nút phản ánh đã gửi
  const handleViewSentFeedback = () => {
    navigate("/kiennghi/phananhdagui");
  };

  return (
    <Page className=" bg-gray-50">
      {/* Question text */}
      <Box onClick={handleSendFeedback} className="p-4 bg-white">
        <Text className="text-gray-600 text-sm">Bạn có sự việc cần phản ánh ?</Text>
      </Box>

      {/* Action buttons */}
      <Box className="flex p-4 bg-white border-b border-gray-200 space-x-2">
        <Button
          className="flex-1 flex items-center justify-center bg-blue-600 text-white border-none rounded-lg"
          onClick={handleSendFeedback}
          size="small"
        >
          <Box className="flex items-center justify-center">
            <Icon icon="zi-share" className="mr-2" size={15} />
            <Text className="text-white">Gửi phản ánh</Text>
          </Box>
        </Button>

        <Button
          className="flex-1 flex items-center justify-center bg-blue-600 text-white border-none rounded-lg"
          onClick={handleViewSentFeedback}
          size="small"
        >
          <Box className="flex items-center justify-center">
            <Icon icon="zi-clock-1" className="mr-2" size={15} />
            <Text className="text-white">Phản ánh đã gửi</Text>
          </Box>
        </Button>
      </Box>

      {/* Danh sách phản ánh */}
      <Box className="flex-1 overflow-auto">
        {danhSachPhanAnh.length > 0 ? (
          <Box className="">
            {danhSachPhanAnh.map((item) => (
              <Box
                key={item.id}
                className="bg-white mb-2 shadow-sm"
                onClick={() => handleViewDetail(item.id)}
              >
                {/* Image placeholder */}
                <Box className="w-full h-48 bg-gray-200 relative">
                  <img
                    src={item.hinhAnh || "https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=Phản+ánh+hiện+trường"}
                    alt="Phản ánh"
                    className="w-full h-full object-cover"
                  />
                </Box>

                {/* Content */}
                <Box className="p-4">
                  <Text className="font-medium text-gray-900 mb-2 leading-5">
                    {truncateContent(item.noiDung, 100)}
                  </Text>

                  {/* Time and location info */}
                  <Box className="flex items-center text-xs text-gray-500">
                    <Icon icon="zi-clock-1" size={12} className="mr-1" />
                    <Text className="mr-4">{formatDateTime(item.thoiGianGui)}</Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box className="flex flex-col items-center justify-center py-20">
            <Icon icon="zi-note" size={48} className="text-gray-300 mb-4" />
            <Text className="text-gray-500">Chưa có phản ánh nào</Text>
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default DanhSachPhanAnh;