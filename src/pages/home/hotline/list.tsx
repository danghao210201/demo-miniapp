import React, { FC } from "react";
import { Box, Page, Text, Icon } from "zmp-ui";
import TransitionLink from "@/components/transition-link";

interface DuongDayNong {
  id: string;
  tenDonVi: string;
  soDienThoai: string;
  moTa?: string;
  icon?: string;
  mauSac?: string;
}

export default function DuongDayNongPage() {

  // Danh sách đường dây nóng
  const danhSachDuongDayNong: DuongDayNong[] = [
    {
      id: "1",
      tenDonVi: "Công an Phường Long Hoa",
      soDienThoai: "0276.3123456",
      moTa: "Tiếp nhận thông tin an ninh trật tự 24/7",
      icon: "zi-shield",
      mauSac: "#D32F2F"
    },
    {
      id: "2",
      tenDonVi: "Trạm Y tế Phường Long Hoa",
      soDienThoai: "0276.3789012",
      moTa: "Tư vấn y tế, cấp cứu",
      icon: "zi-heart",
      mauSac: "#1976D2"
    },
    {
      id: "3",
      tenDonVi: "UBND Phường Long Hoa",
      soDienThoai: "0276.3456789",
      moTa: "Tiếp nhận phản ánh, kiến nghị",
      icon: "zi-home",
      mauSac: "#388E3C"
    },
    {
      id: "4",
      tenDonVi: "Điện lực Long Hoa",
      soDienThoai: "0276.3234567",
      moTa: "Sự cố điện, mất điện",
      icon: "zi-flash",
      mauSac: "#FFA000"
    },
    {
      id: "5",
      tenDonVi: "Cấp nước Long Hoa",
      soDienThoai: "0276.3345678",
      moTa: "Sự cố nước, mất nước",
      icon: "zi-water",
      mauSac: "#0097A7"
    },
    {
      id: "6",
      tenDonVi: "Phòng cháy chữa cháy",
      soDienThoai: "114",
      moTa: "Báo cháy, cứu nạn cứu hộ",
      icon: "zi-fire",
      mauSac: "#E64A19"
    },
    {
      id: "7",
      tenDonVi: "Cứu thương",
      soDienThoai: "115",
      moTa: "Cấp cứu y tế khẩn cấp",
      icon: "zi-plus",
      mauSac: "#D81B60"
    },
    {
      id: "8",
      tenDonVi: "Công an",
      soDienThoai: "113",
      moTa: "Báo án khẩn cấp",
      icon: "zi-shield",
      mauSac: "#303F9F"
    }
  ];

  // Xử lý khi nhấn vào số điện thoại để gọi
  const handleCall = (soDienThoai: string) => {
    window.location.href = `tel:${soDienThoai}`;
  };

  return (
    <Page className="flex flex-col bg-gray-100">
      {/* Danh sách đường dây nóng */}
      <Box className="flex-1 overflow-auto p-4">
        <Box className="grid grid-cols-1 gap-4">
          {danhSachDuongDayNong.map((item) => (
            <Box 
              key={item.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-200 active:scale-95 active:shadow-sm"
            >
              <Box className="flex items-stretch">
                {/* Icon bên trái */}
                <Box 
                  className="w-20 flex items-center justify-center" 
                  style={{ backgroundColor: item.mauSac || '#D32F2F' }}
                >
                
                </Box>
                
                {/* Thông tin chính */}
                <Box className="flex-1 p-4">
                  <Text className="font-bold text-base mb-1">{item.tenDonVi}</Text>
                  <Text className="text-gray-600 text-sm mb-2">{item.moTa}</Text>
                  
                  {/* Nút gọi */}
                  <Box 
                    className="flex items-center mt-2 active:opacity-70" 
                    onClick={() => handleCall(item.soDienThoai)}
                  >
                    <Icon icon="zi-call" className="text-green-600 mr-2" />
                    <Text className="text-green-600 font-medium">{item.soDienThoai}</Text>
                  </Box>
                </Box>
                
                {/* Nút gọi bên phải */}
                <Box 
                  className="w-16 flex items-center justify-center bg-green-50 active:bg-green-100" 
                  onClick={() => handleCall(item.soDienThoai)}
                >
                  <Icon icon="zi-call" className="text-green-600 text-2xl" />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Thông tin bổ sung */}
        <Box className="mt-6 bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-center text-gray-500 text-sm">
            Các đường dây nóng hoạt động 24/7. Vui lòng chỉ gọi trong trường hợp cần thiết.
          </Text>
        </Box>
      </Box>
    </Page>
  );
};
