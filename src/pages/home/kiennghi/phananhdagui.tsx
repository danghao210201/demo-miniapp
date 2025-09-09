import { useEffect, useState } from "react";
import { Box, Text, Icon, Button } from "zmp-ui";
import TransitionLink from "@/components/transition-link";
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

export default function PhanAnhDaGui() {
  const [danhSachPhanAnh, setDanhSachPhanAnh] = useState<PhanAnh[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setDanhSachPhanAnh(phananh);
      setIsLoading(false);
    }, 800);
  }, []);

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${
      date.getHours()
    }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
  };

  const truncateContent = (content: string, maxLength: number = 60) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-h-0">
      {/* Danh sách phản ánh */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <Box className="flex flex-col items-center justify-center py-10">
            <Text className="text-gray-500 mb-4">Đang tải dữ liệu...</Text>
          </Box>
        ) : danhSachPhanAnh.length > 0 ? (
          <Box className="space-y-4">
            {danhSachPhanAnh.map((item) => (
              <TransitionLink
                key={item.id}
                to={`/kiennghi/chitietphananh?id=${item.id}`}
                className="block"
              >
                <Box className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50">
                  <Box className="flex justify-between items-start mb-2">
                    <Box className="flex items-center">
                      <Box
                        className={`w-2 h-2 rounded-full mr-2 ${
                          item.phanHoi ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                      <Text className="font-bold">{item.id}</Text>
                    </Box>
                    <Text className="text-xs text-gray-500">
                      {formatDateTime(item.thoiGianGui)}
                    </Text>
                  </Box>

                  <Text className="text-sm mb-2">
                    {truncateContent(item.noiDung)}
                  </Text>

                  <Box className="flex justify-between items-center">
                    <Text className="text-xs text-gray-500 font-medium">
                      {item.tieuDe}
                    </Text>
                  </Box>
                </Box>
              </TransitionLink>
            ))}
          </Box>
        ) : (
          <Box className="flex flex-col items-center justify-center py-10">
            <Icon icon="zi-note" size={48} className="text-gray-300 mb-4" />
            <Text className="text-gray-500 mb-4">
              Bạn chưa gửi phản ánh nào
            </Text>
            <TransitionLink to="/kiennghi/guiphananh">
              <Button
                className="bg-red-600 text-white border-none"
                size="large"
              >
                Gửi phản ánh mới
              </Button>
            </TransitionLink>
          </Box>
        )}
      </div>
    </div>
  );
}
