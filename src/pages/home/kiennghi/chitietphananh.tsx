import React, { FC, useState, useEffect } from "react";
import { Box, Page, Text, Button, Icon } from "zmp-ui";
import phananh from "@/components/mock/kiennghi.json";
import { useLocation, useNavigate } from "react-router-dom";

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

export const ChiTietPhanAnh: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [phanAnhData, setPhanAnhData] = useState<PhanAnh | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Lấy id từ query params
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    if (id) {
      // Tìm phản ánh theo id
      const data = phananh.find((item) => item.id === id);
      if (data) {
        setPhanAnhData(data);
      }
    }
    setLoading(false);
  }, [location]);

  // Định dạng ngày giờ
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
  };

  // Xử lý khi nhấn vào nút quay lại
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Page className="flex flex-col bg-gray-50">
        <Box className="flex-1 flex items-center justify-center">
          <Text className="text-gray-500">Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  if (!phanAnhData) {
    return (
      <Page className="flex flex-col bg-gray-50">
        <Box className="flex-1 flex flex-col items-center justify-center p-4">
          <Text className="text-lg font-bold mb-2">Không tìm thấy phản ánh</Text>
          <Text className="text-gray-500 text-center mb-4">Phản ánh bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</Text>
          <Button
            className="bg-red-600 text-white border-none"
            onClick={handleBack}
            size="large"
          >
            Quay lại
          </Button>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="flex flex-col bg-gray-50">

      {/* Thông tin phản ánh */}
      <Box className="flex-1 overflow-auto">
        {/* Hình ảnh */}
        {phanAnhData.hinhAnh && (
          <Box className="w-full h-64 bg-gray-200">
            <img
              src={phanAnhData.hinhAnh}
              alt="Hình ảnh phản ánh"
              className="w-full h-full object-cover"
            />
          </Box>
        )}

        {/* Thông tin chi tiết */}
        <Box className="bg-white p-4">
          {/* Thông tin người gửi */}
          <Box className="flex items-center mb-4 pb-4 border-b border-gray-100">
            <Box className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <Icon icon="zi-user" className="text-blue-600" size={20} />
            </Box>
            <Box className="flex-1">
              <Text className="font-medium text-gray-900">{phanAnhData.hoTen}</Text>
              <Text className="text-sm text-gray-500">{formatDateTime(phanAnhData.thoiGianGui)}</Text>
            </Box>
          </Box>

          {/* Nội dung phản ánh */}
          <Box className="mb-6">
            <Text className="font-medium text-gray-900 mb-3">Nội dung phản ánh</Text>
            <Text className="text-gray-700 leading-6 whitespace-pre-wrap">{phanAnhData.noiDung}</Text>
          </Box>

          {/* Phản hồi */}
          {phanAnhData.phanHoi && (
            <Box className="bg-green-50 rounded-lg p-4 border border-green-200">
              <Box className="flex items-center mb-3">
                <Box className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <Icon icon="zi-check-circle" className="text-green-600" size={16} />
                </Box>
                <Box className="flex-1">
                  <Text className="font-medium text-green-800">Phản hồi từ cơ quan chức năng</Text>
                  <Text className="text-sm text-green-600">{formatDateTime(phanAnhData.phanHoi.thoiGianPhanHoi)}</Text>
                </Box>
              </Box>
              <Text className="text-green-800 leading-6 whitespace-pre-wrap pl-11">{phanAnhData.phanHoi.noiDung}</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default ChiTietPhanAnh;