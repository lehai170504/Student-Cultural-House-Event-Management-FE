import { MessageSquare, Clock, MapPin } from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

export default function ContactFeatures() {
  const features: Feature[] = [
    {
      icon: MessageSquare,
      title: "Phản hồi nhanh",
      description: "Chúng tôi cam kết phản hồi mọi thắc mắc trong vòng 24 giờ.",
    },
    {
      icon: Clock,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc.",
    },
    {
      icon: MapPin,
      title: "Vị trí thuận tiện",
      description: "Tọa lạc tại trung tâm thành phố, dễ dàng di chuyển.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

