import React, { FC, useState } from "react";
import { Box, Page, Text, Button, Icon, Header, Input } from "zmp-ui";
import { useNavigate } from "react-router-dom";


export const GuiPhanAnh: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    noiDung: "",
    congKhai: "" // "public" hoặc "private"
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [errors, setErrors] = useState({
    noiDung: "",
    congKhai: ""
  });
  
  const handleNoiDungChange = (e) => {
    const text = e.target.value;
    setWordCount(text.length); // Đếm số ký tự
    setFormData({
      ...formData,
      noiDung: text
    });
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (text.trim()) {
      setErrors(prev => ({ ...prev, noiDung: "" }));
    }
  };
  // Xử lý thay đổi nội dung
  const handleContentChange = (value: string) => {
    setFormData({
      ...formData,
      noiDung: value
    });
  };

  // Xử lý thay đổi công khai
  const handleCongKhaiChange = (value: string) => {
    setFormData({
      ...formData,
      congKhai: value
    });
    // Xóa lỗi khi người dùng chọn
    setErrors(prev => ({ ...prev, congKhai: "" }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      noiDung: "",
      congKhai: ""
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

  // Xử lý chọn ảnh
  const handleImageSelect = () => {
    // Giả lập chọn ảnh
    console.log("Chọn ảnh");
  };

  // Xử lý gửi phản ánh
  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);

      // Giả lập gửi dữ liệu
      setTimeout(() => {
        setIsSubmitting(false);
        // Chuyển đến trang thành công
        navigate("/kiennghi/danhsachphananh");
      }, 1500);
    }
  };

  return (
    <Page>
      <Box className="report-form">
        <Box className="form-group">
          <label className="label"><span className="text-red-500">*</span> Nội dung phản ánh</label>
          <Input.TextArea 
            className="border-none px-0 w-full focus:outline-none" 
            placeholder="Nhập nội dung phản ánh..." 
            value={formData.noiDung}
            onChange={handleNoiDungChange}
          />
          {errors.noiDung && <Text className="text-red-500 text-sm mt-1">{errors.noiDung}</Text>}
          <hr/>
        </Box>

        <Box className="form-group">
          <label className="label">Hình ảnh đính kèm (tuỳ chọn)</label>
          <div className="image-upload">
            <div className="add-button">+</div>
          </div>
        </Box>

        <Box className="form-group">
          <label className="label"><span className="text-red-500">*</span> Công khai phản ánh</label>
          <div className="radio-group">
            <label>
              <input 
                type="radio" 
                name="public" 
                value="public"
                checked={formData.congKhai === "public"}
                onChange={(e) => handleCongKhaiChange(e.target.value)}
              /> 
              Công khai kết quả xử lý
            </label>
            <label>
              <input 
                type="radio" 
                name="public" 
                value="private"
                checked={formData.congKhai === "private"}
                onChange={(e) => handleCongKhaiChange(e.target.value)}
              /> 
              Chỉ mình tôi có thể xem kết quả
            </label>
          </div>
          {errors.congKhai && <Text className="text-red-500 text-sm mt-1">{errors.congKhai}</Text>}
        </Box>

        <button 
          className="submit-btn" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi"}
        </button>
      </Box>

    </Page>
  );
};

export default GuiPhanAnh;