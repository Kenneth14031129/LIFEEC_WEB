import PropTypes from "prop-types";
import { FileText, Clock, ChevronRight, Activity } from "lucide-react";

const QuickActions = ({
  activeTab,
  healthRecords,
  mealRecords,
  activities,
  onUpdateHealth,
  onAddNewHealth,
  onViewHealthHistory,
  onUpdateMeal,
  onAddNewMeal,
  onViewMealHistory,
  onUpdateActivity,
  onAddNewActivity,
  onViewActivityHistory,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = user.userType?.toLowerCase();
  const isOwner = userType === "owner";

  return (
    <div className="col-span-12 lg:col-span-4 space-y-6 font-[Poppins]">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Quick Actions
        </h2>
        <div className="space-y-3">
          {activeTab === "health" && (
            <div className="space-y-3">
              {!isOwner && (
                <>
                  {healthRecords.length > 0 && (
                    <button
                      onClick={onUpdateHealth}
                      className="w-full flex items-center justify-between p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-cyan-500" />
                        <span className="font-medium text-cyan-700">
                          Update Health Plan
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-cyan-500" />
                    </button>
                  )}

                  <button
                    onClick={onAddNewHealth}
                    className="w-full flex items-center justify-between p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-cyan-500" />
                      <span className="font-medium text-cyan-700">
                        Add New Health Plan
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-cyan-500" />
                  </button>
                </>
              )}

              {healthRecords.length > 0 && (
                <button
                  onClick={onViewHealthHistory}
                  className="w-full flex items-center justify-between p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-cyan-500" />
                    <span className="font-medium text-cyan-700">
                      View Health History
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-cyan-500" />
                </button>
              )}
            </div>
          )}

          {activeTab === "meals" && (
            <div className="space-y-3">
              {!isOwner && (
                <>
                  {mealRecords.length > 0 && (
                    <button
                      onClick={onUpdateMeal}
                      className="w-full flex items-center justify-between p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-cyan-500" />
                        <span className="font-medium text-cyan-700">
                          Update Meal Plan
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-cyan-500" />
                    </button>
                  )}

                  <button
                    onClick={onAddNewMeal}
                    className="w-full flex items-center justify-between p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-cyan-500" />
                      <span className="font-medium text-cyan-700">
                        Add New Meal Plan
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-cyan-500" />
                  </button>
                </>
              )}

              {mealRecords.length > 0 && (
                <button
                  onClick={onViewMealHistory}
                  className="w-full flex items-center justify-between p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-cyan-500" />
                    <span className="font-medium text-cyan-700">
                      View Meal History
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-cyan-500" />
                </button>
              )}
            </div>
          )}

          {activeTab === "activities" && (
            <div className="space-y-3">
              {!isOwner && (
                <>
                  {activities.length > 0 && (
                    <button
                      onClick={onUpdateActivity}
                      className="w-full flex items-center justify-between p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-cyan-500" />
                        <span className="font-medium text-cyan-700">
                          Update Activity Plan
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-cyan-500" />
                    </button>
                  )}

                  <button
                    onClick={onAddNewActivity}
                    className="w-full flex items-center justify-between p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-cyan-500" />
                      <span className="font-medium text-cyan-700">
                        Add New Activity Plan
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-cyan-500" />
                  </button>
                </>
              )}

              {activities.length > 0 && (
                <button
                  onClick={onViewActivityHistory}
                  className="w-full flex items-center justify-between p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-cyan-500" />
                    <span className="font-medium text-cyan-700">
                      View Activity History
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-cyan-500" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

QuickActions.propTypes = {
  activeTab: PropTypes.string.isRequired,
  healthRecords: PropTypes.arrayOf(
    PropTypes.shape({
      length: PropTypes.number,
    })
  ).isRequired,
  mealRecords: PropTypes.arrayOf(
    PropTypes.shape({
      length: PropTypes.number,
    })
  ).isRequired,
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      length: PropTypes.number,
    })
  ).isRequired,
  onUpdateHealth: PropTypes.func.isRequired,
  onAddNewHealth: PropTypes.func.isRequired,
  onViewHealthHistory: PropTypes.func.isRequired,
  onUpdateMeal: PropTypes.func.isRequired,
  onAddNewMeal: PropTypes.func.isRequired,
  onViewMealHistory: PropTypes.func.isRequired,
  onUpdateActivity: PropTypes.func.isRequired,
  onAddNewActivity: PropTypes.func.isRequired,
  onViewActivityHistory: PropTypes.func.isRequired,
};

export default QuickActions;
