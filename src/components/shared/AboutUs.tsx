import Image from 'next/image';

const AboutUs = () => {
  return (
    <section className="bg-transparent py-12 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-700 dark:text-white">About Us</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Discover the world with our travel tips and destination guides. Our platform is designed to connect travel enthusiasts and inspire new adventures.
          </p>
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Image Section */}
          <div className="relative h-80 w-full md:h-full">
            <Image
              src="https://res.cloudinary.com/dsisnya7j/image/upload/v1730976861/dlao2qwnnkfncpzfxjlw.webp"
              alt="Travel illustration"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Text Content Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-100 mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Our mission is to empower travelers with the best tips, stories, and recommendations to make their trips more enjoyable and memorable.
              Whether you are a seasoned traveler or planning your first adventure, our platform offers valuable insights from fellow travelers around the world.
            </p>
            <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-100 mb-4">Why Choose Us?</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Comprehensive destination guides curated by travelers.</li>
              <li>Travel tips from a vibrant community of explorers.</li>
              <li>Access to exclusive premium content for verified users.</li>
              <li>Interactive features to connect with fellow travelers.</li>
            </ul>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Ready to start your next adventure?
          </h2>
          <button className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200">
            Join Us Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
