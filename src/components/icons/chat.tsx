import { SVGProps } from "react";

interface ChatIconProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

/**
 * ChatIcon
 * - Biểu tượng chat dạng SVG 26x26, giữ phong cách đồng nhất với HomeIcon.
 * - Hỗ trợ prop `active` để đổi màu: khi active dùng gradient (theo CSS variables), khi không active màu xám (#DADADA).
 * - Kế thừa mọi props của SVG để tùy biến thêm khi sử dụng.
 */
export default function ChatIcon({ active, ...props }: ChatIconProps) {
  return (
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
      {...props}
    >
      <g clipPath="url(#clip0_chat)">
        {/* Bong bóng chat với đuôi ở góc dưới trái */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 4.5h14c2.209 0 4 1.791 4 4v6c0 2.209-1.791 4-4 4H12l-5.2 4.6c-.49.434-1.3.086-1.3-.56V18.5H6c-2.209 0-4-1.791-4-4v-6c0-2.209 1.791-4 4-4Z"
          fill={active ? "url(#paint0_linear_chat)" : "#DADADA"}
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_chat"
          x1="-2"
          y1="10"
          x2="10"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--primary-gradient)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
        <clipPath id="clip0_chat">
          <rect width="26" height="26" fill="white" transform="translate(0)" />
        </clipPath>
      </defs>
    </svg>
  );
}