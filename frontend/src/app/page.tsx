const HeroSection: React.FC = () => (
  <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
    <h1 className="text-5xl font-bold mb-4">Welcome to CodeOrb</h1>
    <p className="text-xl max-w-2xl mx-auto mb-8">
      Run code in multiple languages right from your browser. Fast, secure, and simple.
    </p>
    <a
      href="#features"
      className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded shadow hover:bg-gray-100 transition"
    >
      Explore Features
    </a>
  </section>
);

const FeatureCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="bg-white rounded shadow p-6 text-center hover:scale-[1.02] transition-[0.5s]">
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => (
  <section id="features" className="py-20 bg-gray-50">
    <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
      <FeatureCard
        title="Language Support"
        description="Run code in Python, Node.js, C, C++, and Java."
      />
      <FeatureCard
        title="Secure Execution"
        description="Every run is isolated using Docker containers."
      />
      <FeatureCard
        title="Simple Interface"
        description="Minimal UI designed to let you focus on the code."
      />
    </div>
  </section>
);

const AboutSection: React.FC = () => (
  <section className="py-20 bg-white">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-6">About CodeOrb</h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        CodeOrb is an in-browser code runner powered by Docker and a Flask backend. 
        It supports multiple languages and is designed for quick testing, learning, and experimentation.
      </p>
    </div>
  </section>
);

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
    </>
  );
}
