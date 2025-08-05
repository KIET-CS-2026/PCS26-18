import {
  Calendar,
  Users,
  Lock,
  ScreenShare,
  MonitorSmartphone,
  Blocks,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: <Calendar className="h-10 w-10" />,
    title: "Smart Scheduling",
    description:
      "Smart scheduling with real-time calendar updates and notifications.",
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Role-based Access Control",
    description:
      "Blockchain-based identity verification with secure, customizable access including Wallet integration for organizations.",
  },
  {
    icon: <Lock className="h-10 w-10" />,
    title: "End-to-End Encryption",
    description:
      "Ensures all communications, including video, audio, and files, remain private and encrypted end-to-end.",
  },
  {
    icon: <ScreenShare className="h-10 w-10" />,
    title: "On Call Features",
    description: "Accessibilty to share screen, chat, poll, screen recording.",
  },
  {
    icon: <MonitorSmartphone className="h-10 w-10" />,
    title: "User Experience",
    description: "Clean user interface and user experience.",
  },
  {
    icon: <Blocks className="h-10 w-10" />,
    title: "Web3 Integration",
    description:
      "Provides security and authorized accessibility, ensuring secure storage and data integrity.",
  },
];

const Features = () => {
  return (
    <section id="features" className="w-full py-12 px-8 md:py-24 lg:px-16">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 flex flex-col items-center text-center space-y-4"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
