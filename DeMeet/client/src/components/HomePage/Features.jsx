import { Calendar, Users, Lock, Wallet, Globe, Blocks } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: <Calendar className="h-10 w-10" />,
    title: "Smart Scheduling",
    description:
      "Smart Scheduling to find the perfect time for everyone with calendars for real-time updates, and sending notifications",
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Role-based Access Control",
    description:
      "Blockchain-based identity verification for secure, customizable access management.",
  },
  {
    icon: <Lock className="h-10 w-10" />,
    title: "End-to-End Encryption",
    description:
      "Your conversations are secure and private, powered by blockchain.",
  },
  {
    icon: <Wallet className="h-10 w-10" />,
    title: "Tokenized Meetings",
    description: "Earn tokens for hosting or attending meetings.",
  },
  {
    icon: <Globe className="h-10 w-10" />,
    title: "Global Accessibility",
    description: "Join from anywhere in the world, no censorship.",
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
    <section
      id="features"
      className="w-full py-12 px-8 md:py-24 lg:py-32 lg:px-16"
    >
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 lg:mb-12">
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
