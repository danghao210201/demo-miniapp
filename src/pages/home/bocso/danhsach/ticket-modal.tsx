import React from 'react';

// Interface cho dữ liệu ticket trong modal
interface TicketData {
  queue_number: string;
  counter_name: string;
  queue_position: number;
  wait_time: number;
  estimated_wait: number;
  status: string;
}

// Props cho TicketModal
interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketData: TicketData | null;
}

/**
 * Component TicketModal - Modal popup hiển thị thông tin số vừa bốc
 */
function TicketModal({ isOpen, onClose, ticketData }: TicketModalProps) {
  if (!isOpen || !ticketData) return null;

  /**
   * Format thời gian chờ - chỉ hiển thị phút
   */
  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}p`;
  };
  /**
   * Xử lý đóng modal khi click overlay
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
        {/* Content */}
        <div className="px-6 py-8">
          {/* Header với icon check và nền xanh */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-green-600 mb-2">Bốc số thành công!</h2>
          </div>

          {/* Số thứ tự */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm mb-3">Số thứ tự của bạn là</p>
            <div className="text-5xl font-bold text-blue-600 mb-4">
              {ticketData.queue_number}
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="space-y-3 mb-6">
            <div className="text-left">
              <span className="text-gray-800 font-medium">Tên quầy: {ticketData.counter_name}</span>
            </div>

            <div className="text-left">
              <span className="text-gray-800 font-medium">Vị trí trong hàng chờ: {ticketData.queue_position}</span>
            </div>

            <div className="text-left">
              <span className="text-gray-800 font-medium">Thời gian chờ dự kiến: {formatWaitTime(ticketData.estimated_wait)}</span>
            </div>

            <div className="text-left">
              <span className="text-gray-800 font-medium">Trạng thái: Đang chờ</span>
            </div>
          </div>

          {/* Lưu ý */}
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm">
              Vui lòng giữ số thứ tự và chờ được gọi
            </p>
          </div>

          {/* Footer */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketModal;