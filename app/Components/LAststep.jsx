const ahpSteps = [
    {
      title: "Define the Goal",
      description:
        "Clearly identify the goal of the decision-making process to focus your analysis.",
      icon: "🎯",
      color: "bg-blue-50",
    },
    {
      title: "Structure the Hierarchy",
      description:
        "Break down the decision problem into a hierarchy: Goal, Criteria, Subcriteria, and Alternatives.",
      icon: "🗂️",
      color: "bg-green-50",
    },
    {
      title: "Pairwise Comparisons",
      description:
        "Perform pairwise comparisons of criteria and alternatives to assign relative importance.",
      icon: "⚖️",
      color: "bg-yellow-50",
    },
    {
      title: "Calculate Priority Vectors",
      description:
        "Use mathematical methods to calculate priority vectors from pairwise comparison matrices.",
      icon: "📊",
      color: "bg-purple-50",
    },
    {
      title: "Check for Consistency",
      description:
        "Ensure consistency in judgments by calculating the Consistency Ratio (CR).",
      icon: "✅",
      color: "bg-pink-50",
    },
    {
      title: "Aggregate Results",
      description:
        "Combine priority vectors to derive the final scores for each alternative.",
      icon: "🔄",
      color: "bg-green-50",
    },
    {
      title: "Make the Final Decision",
      description:
        "Select the best alternative based on the scores and prioritize your options.",
      icon: "🏆",
      color: "bg-blue-50",
    },
  ];
  
  export default function AHPSteps() {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800" id="steps">
          Steps of the Analytic Hierarchy Process (AHP)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ahpSteps.map((step, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-md ${step.color} hover:shadow-lg transition-shadow`}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="font-semibold text-lg text-gray-700 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  