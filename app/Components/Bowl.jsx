import React from 'react';

export default function Bowl() {
  return (
    <section className="py-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto flex items-center justify-between" id='mcda'>
        {/* Left side: SVG Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="/bowl.svg"
            alt="MCDA Illustration"
            className="w-3/4 " // Adjust the size to make the SVG bigger
          />
        </div>

        {/* Right side: Text Content */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-6">
            Multi-criteria decision analysis (MCDA)
          </h2>

          <div className="space-y-4">
            <p className="text-lg flex items-center">
              <span className="mr-2 text-green-500">✅</span>
              Alternatives (or individuals) to be ranked or chosen
            </p>
            <p className="text-lg flex items-center">
              <span className="mr-2 text-green-500">✅</span>
              Criteria by which the alternatives are evaluated and compared
            </p>
            <p className="text-lg flex items-center">
              <span className="mr-2 text-green-500">✅</span>
              Weights representing the relative importance of the criteria
            </p>
            <p className="text-lg flex items-center">
              <span className="mr-2 text-green-500">✅</span>
              Decision-makers and potentially other stakeholders whose preferences are to be represented
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
