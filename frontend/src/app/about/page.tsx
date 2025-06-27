const AboutPage: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <section className="mb-16">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">What is CodeOrb?</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          <strong>CodeOrb</strong> is a browser-based code execution platform built with a containerized backend. It supports multiple programming languages including Python, C, C++, Java, and Node.js - all executed securely using Docker.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Whether you're testing algorithms, exploring new syntax, or teaching others, CodeOrb offers a fast and distraction-free playground. No installations, no boilerplate - just code and run.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          The UI is intentionally minimal. The backend is designed for sandboxing. Everything focuses on one goal: <strong>let you code as quickly and cleanly as possible.</strong>
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-4xl font-semibold mb-6 text-gray-900">Behind the Code</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          I'm <strong>Soham Kakkar</strong>, an undergraduate developer who cares about clean tooling, developer experience, and systems programming. Most online code editors either feel bloated, restrict usage, or lack transparency in how they work. CodeOrb was built as a minimal, Open Source alternative that gives you full control over how code is run - without unnecessary overhead.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          The platform is still growing. A more polished frontend, user accounts, live collaboration, async enhancements - all are in the roadmap. But at its core, CodeOrb will always stay simple, fast, and developer-first.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4 text-gray-900">Want to Get Involved?</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Feedback, issues, feature ideas, or even code - it's all welcome. Check out the GitHub repo, drop a message, or contribute directly. The project is MIT licensed and open to collaborators.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          CodeOrb isn't backed by a company or a framework team. It's a solo-built dev tool, built for other devs. Your ideas and improvements can shape what it becomes.
        </p>
      </section>
    </main>
  );
};

export default AboutPage;
