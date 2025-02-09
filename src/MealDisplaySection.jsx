import PropTypes from "prop-types";
import { Apple, Pizza, UtensilsCrossed, AlertCircle } from "lucide-react";

const MealIcon = ({ mealType }) => {
  switch (mealType) {
    case "breakfast":
      return <Apple className="h-5 w-5 text-cyan-500" />;
    case "lunch":
      return <Pizza className="h-5 w-5 text-cyan-500" />;
    case "dinner":
      return <UtensilsCrossed className="h-5 w-5 text-cyan-500" />;
    default:
      return <Apple className="h-5 w-5 text-cyan-500" />;
  }
};

MealIcon.propTypes = {
  mealType: PropTypes.oneOf(["breakfast", "lunch", "snacks", "dinner"])
    .isRequired,
};

const renderMealItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-gray-500 italic">No items specified</p>;
  }

  return (
    <ul className="list-disc list-inside space-y-1 ml-2">
      {items.map((item, index) => (
        <li key={index} className="text-gray-600">
          {item}
        </li>
      ))}
    </ul>
  );
};

const MealDisplaySection = ({ mealData }) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meal Plan</h1>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">Date:</span>
            <span className="text-gray-600">
              {mealData.date || "Not specified"}
            </span>
          </div>
        </div>
      </div>

      {/* Dietary Information Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Dietary Needs */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Dietary Needs
            </h2>
          </div>
          <div className="p-4 bg-red-50/50 rounded-lg">
            <p className="text-gray-900">
              {mealData.dietaryNeeds || "No dietary needs specified"}
            </p>
          </div>
        </div>

        {/* Nutritional Goals */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Nutritional Goals
            </h2>
          </div>
          <div className="p-4 bg-red-50/50 rounded-lg">
            <p className="text-gray-900">
              {mealData.nutritionalGoals || "No nutritional goals specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Meal Schedule Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-50 rounded-lg">
            <UtensilsCrossed className="h-5 w-5 text-cyan-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Meal Schedule</h2>
        </div>
        <div className="space-y-4">
          {["breakfast", "lunch", "snacks", "dinner"].map((mealType) => (
            <div
              key={mealType}
              className="p-4 bg-gray-50/80 rounded-lg border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-cyan-50 rounded-lg flex items-center justify-center mt-1">
                  <MealIcon mealType={mealType} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 capitalize mb-2">
                    {mealType}
                  </h4>
                  {renderMealItems(mealData[mealType])}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

MealDisplaySection.propTypes = {
  mealData: PropTypes.shape({
    date: PropTypes.string,
    dietaryNeeds: PropTypes.string,
    nutritionalGoals: PropTypes.string,
    breakfast: PropTypes.arrayOf(PropTypes.string),
    lunch: PropTypes.arrayOf(PropTypes.string),
    snacks: PropTypes.arrayOf(PropTypes.string),
    dinner: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default MealDisplaySection;
