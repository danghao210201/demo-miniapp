import React, { FC, useState, useEffect } from "react";
import { Box, Page, Text, Button, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import phananh from "@/components/mock/kiennghi.json";

interface PhanAnh {
  id: string;
  hoTen: string;
  soDienThoai: string;
  thoiGianGui: string;
  tieuDe: string;
  noiDung: string;
  hinhAnh: string;
  phanHoi?: {
    noiDung: string;
    thoiGianPhanHoi: string;
  };
}

export const PhanAnhDaGui: FC = () => {
  const navigate = useNavigate();
  const [danhSachPhanAnh, setDanhSachPhanAnh] = useState<PhanAnh[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Giả lập tải dữ liệu
    setTimeout(() => {
      // Lấy dữ liệu từ mock data
      setDanhSachPhanAnh(phananh);
      setIsLoading(false);
    }, 800);
  }, []);

  // Định dạng ngày giờ
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
  };

  // Rút gọn nội dung
  const truncateContent = (content: string, maxLength: number = 60) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Xử lý khi nhấn vào xem chi tiết
  const handleViewDetail = (id: string) => {
    navigate(`/kiennghi/chitietphananh?id=${id}`);
  };

  // Xử lý khi nhấn vào nút gửi phản ánh mới
  const handleSendNewFeedback = () => {
    navigate("/kiennghi/guiphananh");
  };

  // Xử lý khi nhấn vào nút quay lại
  const handleBack = () => {
    navigate("/kiennghi/danhsachphananh");
  };

  return (
    <Page className="flex flex-col bg-gray-50">

      {/* Danh sách phản ánh */}
      <Box className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <Box className="flex flex-col items-center justify-center py-10">
            <Text className="text-gray-500 mb-4">Đang tải dữ liệu...</Text>
          </Box>
        ) : danhSachPhanAnh.length > 0 ? (
          <Box className="space-y-4">
            {danhSachPhanAnh.map((item) => (
              <Box
                key={item.id}
                className="bg-white rounded-lg shadow-sm p-4"
                onClick={() => handleViewDetail(item.id)}
              >
                <Box className="flex justify-between items-start mb-2">
                  <Box className="flex items-center">
                    <Box
                      className={`w-2 h-2 rounded-full mr-2 ${item.phanHoi ? 'bg-green-500' : 'bg-yellow-500'}`}
                    />
                    <Text className="font-bold">{item.id}</Text>
                  </Box>
                  <Text className="text-xs text-gray-500">{formatDateTime(item.thoiGianGui)}</Text>
                </Box>
                
                <Text className="text-sm mb-2">{truncateContent(item.noiDung)}</Text>
                
                <Box className="flex justify-between items-center">
                  <Text className="text-xs text-gray-500 font-medium">{item.tieuDe}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box className="flex flex-col items-center justify-center py-10">
            <Icon icon="zi-note" size={48} className="text-gray-300 mb-4" />
            <Text className="text-gray-500 mb-4">Bạn chưa gửi phản ánh nào</Text>
            <Button
              className="bg-red-600 text-white border-none"
              onClick={handleSendNewFeedback}
              size="large"
            >
              Gửi phản ánh mới
            </Button>
          </Box>
        )}

      </Box>
    </Page>
  );
};

export default PhanAnhDaGui;