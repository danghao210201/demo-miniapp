import React, { useState, useEffect } from 'react';
import { Text } from 'zmp-ui';

// Interface cho dữ liệu ticket đang chờ
interface UpcomingTicket {
  id: number;
  queue_number: string;
  customer_name: string;
  priority_level: string;
  issue_time: string;
  counter_id: number;
  counter_name: string;
  counter_code: string;
  department_id: number;
  department_name: string;
  department_code: string;
  service_name: string;
  wait_time: number;
  queue_position: number;
}

// Interface cho dữ liệu ticket đang phục vụ
interface ServingTicket {
  id: number;
  queue_number: string;
  customer_name: string;
  counter_id: number;
  counter_name: string;
  counter_code: string;
  service_name: string;
  start_time: string;
}

// Interface cho response API đang chờ
interface UpcomingResponse {
  success: boolean;
  data: UpcomingTicket[];
  meta: {
    total_upcoming: number;
    priority_count: number;
    normal_count: number;
    department: {
      id: number;
      name: string;
      code: string;
      description: string;
    };
    filter_applied: string;
    limit: number;
    timestamp: string;
  };
}

// Interface cho response API đang phục vụ
interface ServingResponse {
  success: boolean;
  data: ServingTicket[];
  meta: {
    total_serving: number;
    department: {
      id: number;
      name: string;
      code: string;
      description: string;
    };
    filter_applied: string;
    timestamp: string;
  };
}

// Interface cho dữ liệu quầy
interface Counter {
  id: number;
  name: string;
  code: string;
  description: string;
  status: string;
  staff_id: string | null;
  queue_count: number;
  department_id: number;
}

// Interface cho response API quầy
interface CountersResponse {
  success: boolean;
  message: string;
  data: Counter[];
  department: {
    id: number;
    code: string;
    name: string;
  };
  total_counters: number;
}

/**
 * Component TicketList - Hiển thị danh sách số thứ tự phục vụ
 */
function TicketList() {
  const [activeTab, setActiveTab] = useState<'serving' | 'waiting'>('serving');
  const [servingTickets, setServingTickets] = useState<ServingTicket[]>([]);
  const [upcomingTickets, setUpcomingTickets] = useState<UpcomingTicket[]>([]);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');



  // Fetch danh sách quầy khi component mount
  useEffect(() => {
    fetchCounters();
  }, []);

  // Fetch dữ liệu ticket khi có quầy được chọn
  useEffect(() => {
    if (selectedCounter) {
      fetchTicketData();

      // Tự động refresh mỗi 30 giây
      const interval = setInterval(fetchTicketData, 30000);

      return () => clearInterval(interval);
    }
  }, [selectedCounter]);

  /**
   * Lấy danh sách quầy từ API
   */
  const fetchCounters = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://demo8.tayninh.gov.vn/backend/api/kiosk/get_counters.php?department_id=30');
      const data: CountersResponse = await response.json();

      if (data.success) {
        setCounters(data.data);
        // Tự động chọn quầy đầu tiên
        if (data.data.length > 0) {
          setSelectedCounter(data.data[0]);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Không thể tải danh sách quầy');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lấy dữ liệu ticket theo quầy được chọn
   */
  const fetchTicketData = async () => {
    if (!selectedCounter) return;

    try {
      // Gọi API đang phục vụ với filter theo quầy
      const servingResponse = await fetch(`https://demo8.tayninh.gov.vn/backend/api/screen/serving.php?dept_id=30&counter_id=${selectedCounter.id}`);
      const servingData: ServingResponse = await servingResponse.json();

      // Gọi API đang chờ với filter theo quầy
      const upcomingResponse = await fetch(`https://demo8.tayninh.gov.vn/backend/api/screen/upcoming.php?dept_id=30&counter_id=${selectedCounter.id}`);
      const upcomingData: UpcomingResponse = await upcomingResponse.json();

      if (servingData.success) {
        // Filter theo counter_id nếu API không hỗ trợ filter
        const filteredServing = servingData.data.filter(ticket => ticket.counter_id === selectedCounter.id);
        setServingTickets(filteredServing);
      }

      if (upcomingData.success) {
        // Filter theo counter_id nếu API không hỗ trợ filter
        const filteredUpcoming = upcomingData.data.filter(ticket => ticket.counter_id === selectedCounter.id);
        setUpcomingTickets(filteredUpcoming);
      }

      setLastUpdate(new Date().toLocaleTimeString('vi-VN'));
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu ticket');
    }
  };

  /**
   * Format thời gian từ string
   */
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
  };

  /**
   * Format thời gian chờ
   */
  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}p`;
  };

  if (loading && servingTickets.length === 0 && upcomingTickets.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Đang tải danh sách bốc số...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => selectedCounter ? fetchTicketData() : fetchCounters()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Tab scroll ngang quầy */}
      <div className="bg-gray-50 p-4">
        <div className="flex overflow-x-auto gap-2 pb-2">
          {counters.map((counter) => (
            <button
              key={counter.id}
              onClick={() => setSelectedCounter(counter)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm border ${selectedCounter?.id === counter.id
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
              <div className="text-center">
                <div className="font-semibold">{counter.name}</div>
                <div className="text-xs opacity-75">
                  {counter.status === 'active' ? 'Hoạt động' : 'Bận'} • {counter.queue_count} chờ
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Header hiển thị quầy được chọn */}
      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div style={{ backgroundColor: "#00885F" }} className="w-4 h-4 bg-green-500 rounded"></div>

          <Text className="text-sm text-gray-700">Đang phục vụ</Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 rounded"></div>
          <Text className="text-sm text-gray-700">Đang chờ</Text>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Bảng tổng hợp tất cả khách hàng */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header bảng */}
          <div className="grid grid-cols-3 bg-blue-500 text-white">
            <div className="py-3 px-4 text-center font-medium border-r border-blue-400">
              Số thứ tự
            </div>
            <div className="py-3 px-4 text-center font-medium border-r border-blue-400">
              Người hẹn
            </div>
            <div className="py-3 px-4 text-center font-medium">
              Trạng thái
            </div>
          </div>

          {/* Nội dung bảng */}
          {servingTickets.length === 0 && upcomingTickets.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              Hiện tại không có khách hàng nào
            </div>
          ) : (
            <>
              {/* Hiển thị khách hàng đang được phục vụ */}
               {servingTickets.map((ticket, index) => (
                 <div key={`serving-${ticket.id}`} className="grid grid-cols-3 border-b border-gray-200" style={{backgroundColor: '#00885F'}}>
                   <div className="py-3 px-4 text-center border-r border-gray-200">
                     <span className="font-bold text-lg text-white">
                       {ticket.queue_number}
                     </span>
                   </div>
                   <div className="py-3 px-4 text-center border-r border-gray-200 text-white">
                     Khách hàng trực tiếp
                   </div>
                   <div className="py-3 px-4 text-center">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-green-800">
                       Đang phục vụ
                     </span>
                   </div>
                 </div>
               ))}
              
              {/* Hiển thị khách hàng đang chờ */}
               {upcomingTickets.map((ticket, index) => (
                 <div key={`upcoming-${ticket.id}`} className="grid grid-cols-3 border-b border-gray-200 bg-blue-200">
                   <div className="py-3 px-4 text-center border-r border-gray-200">
                     <span className="font-bold text-lg text-blue-800">
                       {ticket.queue_number}
                     </span>
                   </div>
                   <div className="py-3 px-4 text-center border-r border-gray-200 text-blue-800">
                     Khách hàng trực tiếp
                   </div>
                   <div className="py-3 px-4 text-center">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                       Đang chờ
                     </span>
                   </div>
                 </div>
               ))}
            </>
          )}
        </div>

        {/* Footer với thông tin cập nhật */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <span>Cập nhật lần cuối: {lastUpdate}</span>
          <button
            onClick={() => selectedCounter ? fetchTicketData() : fetchCounters()}
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Làm mới</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketList;