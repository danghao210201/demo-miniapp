import React, { useState, useEffect, useRef } from 'react';
import TicketModal from './ticket-modal';
import { getUserInfo } from 'zmp-sdk/apis';
import { Icon, Modal, Text } from 'zmp-ui';

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

// Interface cho response API
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

// Interface cho ticket response
interface TicketResponse {
  success: boolean;
  message: string;
  data?: {
    queue_number: string;
    counter_name: string;
    queue_position: number;
    wait_time: number;
    status: string;
  };
}

// Interface cho lịch sử bốc số
interface HistoryRecord {
  id: number;
  queue_number: string;
  customer_name: string;
  zaloid: string;
  zaloname: string;
  tayninhid: string;
  date: string;
  time: string;
  created_at: string;
  status: string;
  department_id: number;
  department_name: string;
  department_code: string;
  counter_id: number;
  counter_name: string;
  counter_code: string;
  service_id: number;
  service_name: string;
  service_description: string;
  priority_level: string;
  issue_time: string;
  customer_phone: string;
  call_time: string | null;
  start_time: string | null;
  complete_time: string | null;
  identification_method: string;
  status_display: string;
}

// Interface cho response API lịch sử
interface HistoryResponse {
  success: boolean;
  data: {
    records: HistoryRecord[];
  };
}

/**
 * Component CounterList - Hiển thị danh sách quầy với nút bốc số
 */
function CounterList() {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [generatingTicket, setGeneratingTicket] = useState<number | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // State cho phân trang/infinite scroll
  const [page, setPage] = useState<number>(1);
  const pageSize = 10; // số bản ghi mỗi lần tải
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch danh sách quầy và thông tin user khi component mount
  useEffect(() => {
    fetchCounters(1, true);
    fetchUserInfo();
  }, []);

  /**
   * Lấy thông tin người dùng từ Zalo API
   */
  const fetchUserInfo = async () => {
    try {
      const { userInfo: info } = await getUserInfo({});
      setUserInfo(info);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setError('Không thể lấy thông tin người dùng từ Zalo');
    }
  };

  /**
   * Kiểm tra lịch sử bốc số của người dùng cho quầy cụ thể
   * Trả về true nếu đã có số chưa hoàn thành, false nếu chưa có hoặc đã hoàn thành
   */
  const checkTicketHistory = async (counterId: number): Promise<boolean> => {
    if (!userInfo?.id) {
      return false;
    }

    try {
      const response = await fetch(`https://demo8.tayninh.gov.vn/backend/api/stats/customer_search.php?zaloid=${userInfo.id}`);
      const data: HistoryResponse = await response.json();

      if (data.success && data.data.records) {
        // Kiểm tra xem đã bốc số cho quầy này chưa và trạng thái chưa hoàn thành
        const hasActiveTicketForCounter = data.data.records.some(record =>
          record.counter_id === counterId && 
          record.zaloid === userInfo.id &&
          record.status !== 'completed' && // Chỉ chặn nếu chưa hoàn thành
          record.complete_time === null // Kiểm tra thêm complete_time để đảm bảo
        );
        return hasActiveTicketForCounter;
      }
      return false;
    } catch (error) {
      console.error('Error checking ticket history:', error);
      return false;
    }
  };

  /**
   * Lấy danh sách quầy từ API với hỗ trợ phân trang.
   * - pageArg: số trang cần tải.
   * - replace: true sẽ thay thế danh sách hiện tại (dùng cho load lần đầu/refresh), false sẽ nối thêm vào danh sách hiện tại.
   */
  const fetchCounters = async (pageArg: number = 1, replace: boolean = false) => {
    try {
      if (pageArg === 1 || replace) {
        setLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      const url = `https://demo8.tayninh.gov.vn/backend/api/kiosk/get_counters.php?department_id=30&page=${pageArg}&limit=${pageSize}`;
      const response = await fetch(url);
      const data: CountersResponse = await response.json();

      if (data.success) {
        const newItems = data.data || [];

        if (replace) {
          setCounters(newItems);
          setPage(1);
        } else {
          // Gộp dữ liệu và loại bỏ trùng theo id
          setCounters(prev => {
            const map = new Map<number, Counter>();
            prev.forEach(it => map.set(it.id, it));
            newItems.forEach(it => map.set(it.id, it));
            return Array.from(map.values());
          });
          setPage(pageArg);
        }

        // Xác định còn dữ liệu nữa không
        if (data.total_counters && data.total_counters > 0) {
          const currentCount = (replace ? 0 : counters.length) + newItems.length;
          setHasMore(currentCount < data.total_counters);
        } else {
          // fallback: nếu API không trả tổng, dựa vào kích thước trang
          setHasMore(newItems.length >= pageSize);
        }
      } else {
        setError(data.message);
        setHasMore(false);
      }
    } catch (err) {
      setError('Không thể tải danh sách quầy');
      setHasMore(false);
    } finally {
      if (pageArg === 1 || replace) {
        setLoading(false);
      } else {
        setIsFetchingMore(false);
      }
    }
  };

  /**
   * Hiển thị modal lỗi với thông báo tùy chỉnh
   */
  const showErrorModal = (message: string) => {
    setErrorMessage(message);
    setIsErrorModalOpen(true);
  };

  /**
   * Hiển thị modal xác nhận bốc số
   */
  const showConfirmModal = async (counter: Counter) => {
    if (!userInfo?.id) {
      showErrorModal('Không thể lấy thông tin người dùng. Vui lòng thử lại.');
      return;
    }

    // Kiểm tra lịch sử bốc số
    const hasActiveTicket = await checkTicketHistory(counter.id);
    if (hasActiveTicket) {
      showErrorModal(`Bạn đã bốc số ở quầy ${counter.name}. Vui lòng hoàn thành thủ tục trước khi bốc số mới.`);
      return;
    }

    setSelectedCounter(counter);
    setIsConfirmModalOpen(true);
  };

  /**
   * Xử lý bốc số cho quầy sau khi xác nhận
   */
  const handleGenerateTicket = async () => {
    if (!selectedCounter || !userInfo) {
      alert('Không thể lấy thông tin người dùng. Vui lòng thử lại.');
      return;
    }

    try {
      setGeneratingTicket(selectedCounter.id);
      setIsConfirmModalOpen(false);

      const requestBody = {
        department_id: 30,
        counter_id: selectedCounter.id,
        department_code: "PNT30",
        zaloid: userInfo.id,
        zaloname: userInfo.name,
        tayninhid: "021313032",
        queue_rule: "n+001",
        customer_phone: "0326685064"
      };

      const response = await fetch('https://demo6.tayninh.gov.vn/backend/api/kiosk/generate_ticket_enhanced.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data: TicketResponse = await response.json();

      if (data.success && data.data) {
        setTicketData({
          ...data.data,
          counter_name: selectedCounter.name
        });
        setIsModalOpen(true);
      } else {
        alert('Không thể bốc số: ' + data.message);
      }
    } catch (err) {
      alert('Lỗi khi bốc số');
    } finally {
      setGeneratingTicket(null);
      setSelectedCounter(null);
    }
  };

  /**
   * Thiết lập IntersectionObserver để tự động tải thêm khi phần tử sentinel xuất hiện trên màn hình.
   */
  useEffect(() => {
    if (!hasMore || loading || isFetchingMore) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting && hasMore && !isFetchingMore && !loading) {
        fetchCounters(page + 1, false);
      }
    }, { threshold: 0.1 });

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [hasMore, isFetchingMore, loading, page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Đang tải danh sách quầy...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {counters.map((counter) => (
          <div key={counter.id} className="bg-white rounded-lg shadow-md p-4 border">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">{counter.name}</h3>
                <p className="text-sm text-gray-600 mb-1">Mã: {counter.code}</p>
                <p className="text-sm text-gray-600">{counter.description}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${counter.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {counter.status === 'active' ? 'Hoạt động' : 'Bận'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Số người chờ: <span className="font-medium">{counter.queue_count}</span>
              </div>

              <button
                onClick={() => showConfirmModal(counter)}
                disabled={generatingTicket === counter.id}
                className={`px-4 py-2 rounded-lg font-medium ${generatingTicket !== counter.id
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {generatingTicket === counter.id ? 'Đang bốc số...' : 'Bốc số'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Khu vực hiển thị loader và sentinel cho infinite scroll */}
      <div className="mt-4 flex flex-col items-center justify-center text-sm text-gray-500">
        {isFetchingMore && (
          <div className="py-3">Đang tải thêm...</div>
        )}
        {!hasMore && counters.length > 0 && (
          <div className="py-3">Đã tải hết dữ liệu</div>
        )}
        {/* Sentinel để IntersectionObserver theo dõi */}
        <div ref={sentinelRef} className="h-6" />
      </div>

      {/* Modal xác nhận bốc số */}
      <Modal
        visible={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Xác nhận bốc số"
        actions={[
          {
            text: "Hủy",
            close: true,
            onClick: () => setIsConfirmModalOpen(false)
          },
          {
            text: "Xác nhận",
            highLight: true,
            onClick: handleGenerateTicket
          }
        ]}
      >
        {selectedCounter && (
          <div className="p-4">
            <div className="text-center mb-4">
              <Icon icon="zi-help-circle" className="text-blue-600 mx-auto mb-3" size={48} />
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Bạn có muốn bốc số cho thủ tục này không?
              </Text>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <Text className="font-semibold text-gray-900 mb-2">{selectedCounter.name}</Text>
              <Text className="text-sm text-gray-600">
                {selectedCounter.description || 'Không có mô tả chi tiết'}
              </Text>
            </div>
            <div className="text-center">
              <Text className="text-xs text-gray-500">
                Hiện tại có {selectedCounter.queue_count} người đang chờ
              </Text>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal thông báo lỗi */}
      <Modal
        visible={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Thông báo"
        actions={[
          {
            text: "Đóng",
            close: true,
            highLight: true,
            onClick: () => setIsErrorModalOpen(false)
          }
        ]}
      >
        <div className="p-4">
          <div className="text-center mb-4">
            <Icon icon="zi-warning" className="text-orange-500 mx-auto mb-3" size={48} />
            <Text className="text-base text-gray-900">
              {errorMessage}
            </Text>
          </div>
        </div>
      </Modal>

      {/* Modal hiển thị thông tin số vừa bốc */}
      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticketData={ticketData}
      />
    </div>
  );
}

export default CounterList;