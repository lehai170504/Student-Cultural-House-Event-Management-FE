"use client";

import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* --- Hero Banner --- */}
      <section className="relative bg-orange-500 text-white py-20">
        <div className="container mx-auto text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Chào mừng đến với Nhà Văn Hóa Sinh Viên
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Nơi tổ chức sự kiện, giao lưu văn hóa và hoạt động cho sinh viên
          </p>
          <button className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl shadow hover:bg-gray-100 transition">
            Khám phá sự kiện
          </button>
        </div>
      </section>

      {/* --- Featured Events --- */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Sự kiện nổi bật
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Event Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <Image
              src="https://source.unsplash.com/600x400/?concert,students"
              alt="Event 1"
              width={600}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Đêm nhạc Sinh Viên 2025
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Thời gian: 20/10/2025 <br />
                Địa điểm: Hội trường lớn
              </p>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                Tham gia ngay
              </button>
            </div>
          </div>

          {/* Event Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <Image
              src="https://source.unsplash.com/600x400/?festival,students"
              alt="Event 2"
              width={600}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Lễ hội Văn Hóa Quốc Tế
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Thời gian: 05/11/2025 <br />
                Địa điểm: Sân ngoài trời
              </p>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                Xem chi tiết
              </button>
            </div>
          </div>

          {/* Event Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <Image
              src="https://source.unsplash.com/600x400/?workshop,students"
              alt="Event 3"
              width={600}
              height={400}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Workshop Khởi Nghiệp
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Thời gian: 15/12/2025 <br />
                Địa điểm: Phòng 204
              </p>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Membership Section --- */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Thẻ Thành Viên & Tích Điểm
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Đăng ký thẻ thành viên để tham gia sự kiện dễ dàng hơn, tích điểm
            đổi quà và nhận nhiều ưu đãi dành riêng cho sinh viên.
          </p>
          <div className="flex justify-center">
            <div className="bg-white shadow-md rounded-xl p-6 max-w-sm">
              <Image
                src="https://source.unsplash.com/400x200/?idcard,student"
                alt="Membership Card"
                width={400}
                height={200}
                className="rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-orange-600 mb-2">
                Student Member Card
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Sở hữu ngay thẻ thành viên để tích điểm mỗi khi tham gia sự kiện
                và đổi quà hấp dẫn.
              </p>
              <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition">
                Đăng ký thẻ
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
