const steps = [
  {
    number: "1",
    title: "Register & Set Up",
    description:
      "Sign up using your email or blockchain wallet for secure authentication.",
  },
  {
    number: "2",
    title: "Create or Join a Personal Meeting",
    description:
      "Start an instant meeting or schedule one with smart scheduling features.",
  },
  {
    number: "3",
    title: "Use Wallet to Join an Organization",
    description:
      "Authenticate with your blockchain wallet to access your organization’s meetings securely.",
  },
  {
    number: "4",
    title: "Collaborate Seamlessly",
    description:
      "Engage in encrypted video calls with screen sharing, polls, and secure file sharing.",
  },
  {
    number: "5",
    title: "Access Meeting Records Securely",
    description:
      "View securely stored meeting logs and recordings via decentralized storage.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="w-full py-12 px-8 md:py-24 lg:px-16">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-16">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary text-primary-foreground p-2 px-4 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
