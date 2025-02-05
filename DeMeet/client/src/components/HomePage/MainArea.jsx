import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, Card } from "@/components/ui/card";
import { Calendar, Users, Lock, Wallet, Globe, Blocks } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <Blocks className="h-6 w-6" />
          <span className="ml-2 text-2xl font-bold">DecenMeet</span>
        </a>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#how-it-works"
          >
            How It Works
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#pricing"
          >
            Pricing
          </a>
          <Button variant="outline" size="sm">
            Connect Wallet
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Decentralized Meetings for the Web3 Era
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Experience secure, private, and decentralized video meetings
                  powered by blockchain technology.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 border-y-2"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Calendar className="h-10 w-10" />}
                title="Smart Scheduling"
                description="AI-powered scheduling to find the perfect time for everyone."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10" />}
                title="Decentralized Identity"
                description="Login with your blockchain wallet. No passwords needed."
              />
              <FeatureCard
                icon={<Lock className="h-10 w-10" />}
                title="End-to-End Encryption"
                description="Your conversations are secure and private, powered by blockchain."
              />
              <FeatureCard
                icon={<Wallet className="h-10 w-10" />}
                title="Tokenized Meetings"
                description="Earn tokens for hosting or attending meetings."
              />
              <FeatureCard
                icon={<Globe className="h-10 w-10" />}
                title="Global Accessibility"
                description="Join from anywhere in the world, no censorship."
              />
              <FeatureCard
                icon={<Blocks className="h-10 w-10" />}
                title="Web3 Integration"
                description="Seamlessly integrate with other decentralized applications."
              />
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary text-primary-foreground p-2 px-4 mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Use your blockchain wallet to create an account and log in
                  securely.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary text-primary-foreground p-2 px-4 mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Schedule a Meeting</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Use our AI-powered tool to find the best time for all
                  participants.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary text-primary-foreground p-2 px-4 mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Join and Collaborate</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Experience secure, high-quality video meetings with Web3
                  features.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="cta"
          className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to revolutionize your meetings?
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
                  Join the future of decentralized communication. Start your
                  Web3 meeting experience today.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-primary-foreground text-primary"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit" variant="secondary">
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-primary-foreground/60">
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 DecenMeet. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4 text-primary-foreground">
          {icon}
        </div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-center text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
