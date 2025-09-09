import { useState } from "react";
import { Box, Input, Text } from "zmp-ui";
import TransitionLink from "@/components/transition-link";

export default function GuiPhanAnh() {
  const [formData, setFormData] = useState({
    noiDung: "",
    congKhai: "", // "public" hoặc "private"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    noiDung: "",
    congKhai: "",
  });

  // Xử lý thay đổi nội dung
  const handleNoiDungChange = (e: any) => {
    const text = e.target.value;
    setFormData({
      ...formData,
      noiDung: text,
    });
    if (text.trim()) {
      setErrors((prev) => ({ ...prev, noiDung: "" }));
    }
  };

  // Xử lý thay đổi công khai
  const handleCongKhaiChange = (value: string) => {
    setFormData({
      ...formData,
      congKhai: value,
    });
    setErrors((prev) => ({ ...prev, congKhai: "" }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      noiDung: "",
      congKhai: "",
    };

    if (!formData.noiDung.trim()) {
      newErrors.noiDung = "Vui lòng nhập nội dung phản ánh";
    }

    if (!formData.congKhai) {
      newErrors.congKhai = "Vui lòng chọn tùy chọn công khai";
    }

    setErrors(newErrors);
    return !newErrors.noiDung && !newErrors.congKhai;
  };

  // Xử lý gửi phản ánh
  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        // Sau khi gửi thành công thì điều hướng bằng TransitionLink
        window.location.href = "/kiennghi/danhsachphananh";
      }, 1200);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-h-0">

      {/* Nội dung form - vùng cuộn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Nội dung phản ánh */}
        <Box className="form-group">
          <label className="label">
            <span className="text-red-500">*</span> Nội dung phản ánh
          </label>
          <Input.TextArea
            className="border border-gray-300 rounded-lg w-full text-sm p-2"
            placeholder="Nhập nội dung phản ánh..."
            value={formData.noiDung}
            onChange={handleNoiDungChange}
          />
          {errors.noiDung && (
            <Text className="text-red-500 text-sm mt-1">{errors.noiDung}</Text>
          )}
        </Box>

        {/* Hình ảnh đính kèm */}
        <Box className="form-group">
          <label className="label">Hình ảnh đính kèm (tuỳ chọn)</label>
          <div className="w-24 h-24 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 cursor-pointer">
            +
          </div>
        </Box>

        {/* Công khai */}
        <Box className="form-group">
          <label className="label">
            <span className="text-red-500">*</span> Công khai phản ánh
          </label>
          <br/>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="public"
                value="public"
                checked={formData.congKhai === "public"}
                onChange={(e) => handleCongKhaiChange(e.target.value)}
              />
              <span>Công khai kết quả xử lý</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="public"
                value="private"
                checked={formData.congKhai === "private"}
                onChange={(e) => handleCongKhaiChange(e.target.value)}
              />
              <span>Chỉ mình tôi có thể xem kết quả</span>
            </label>
          </div>
          {errors.congKhai && (
            <Text className="text-red-500 text-sm mt-1">{errors.congKhai}</Text>
          )}
        </Box>
      </div>

      {/* Footer - nút gửi */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi Kiến nghị - Phản ánh"}
        </button>
      </div>
    </div>
  );
}
