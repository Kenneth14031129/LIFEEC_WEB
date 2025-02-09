import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  User,
  MapPin,
  Heart,
  Activity,
  AlertCircle,
  UtensilsCrossed,
  Pill,
  Clock,
  ChevronRight,
  ArrowLeft,
  FileText,
  Phone,
  Mail,
  Calendar,
  PhoneCall,
  ChevronLeft,
} from "lucide-react";
import Sidebar from "./SideBar";
import HealthUpdateModal from "./HealthUpdateModal";
import MealUpdateModal from "./MealUpdateModal";
import ActivitiesUpdateModal from "./ActivitiesUpdateModal";
import HealthReviewModal from "./HealthReviewModal";
import MealReviewModal from "./MealReviewModal";
import ActivitiesReviewModal from "./ActivitiesReviewModal";
import MealDisplaySection from "./MealDisplaySection";
import {
  getResidents,
  createHealthRecord,
  getHealthRecords,
  updateHealthRecord,
  getMealRecord,
  createMealRecord,
  updateMealRecord,
  getActivitiesRecord,
  updateActivitiesRecord,
  createActivitiesRecord,
} from "../services/api";
import toast from "react-hot-toast";

const ResidentDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isAddingNewMeal, setIsAddingNewMeal] = useState(false);
  const [isAddingNewActivity, setIsAddingNewActivity] = useState(false);
  const [healthRecords, setHealthRecords] = useState([]);
  const [mealRecords, setMealRecords] = useState([]);
  const [activitiesRecords, setActivitiesRecords] = useState([]);
  const [showHealthHistoryModal, setShowHealthHistoryModal] = useState(false);
  const [showMealHistoryModal, setShowMealHistoryModal] = useState(false);
  const [showActivitiesHistoryModal, setShowActivitiesHistoryModal] =
    useState(false);
  const [residentData, setResidentData] = useState({
    id: "",
    basicInfo: {
      name: "",
      dateOfBirth: "",
      gender: "",
      contact: "",
      email: "",
      joinDate: "",
      address: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      email: "",
      relation: "",
    },
    health: {
      status: "",
      lastUpdated: "",
      medications: [],
      conditions: [],
      allergies: [],
      assessmentNotes: "",
    },
    meals: {
      restrictions: [],
      preferences: [],
      schedule: {
        breakfast: "",
        lunch: "",
        dinner: "",
      },
    },
    activities: [],
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;
  const [isMedicalProfileExpanded, setIsMedicalProfileExpanded] =
    useState(false);

  // Modify the button click handlers
  const handleUpdateClick = () => {
    if (healthRecords.length === 0) {
      toast.error("No health records available to update");
      return;
    }
    setIsAddingNew(false);
    setShowHealthModal(true);
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setShowHealthModal(true);
  };

  const handleMealUpdateClick = () => {
    if (mealRecords.length === 0) {
      toast.error("No meal records available to update");
      return;
    }
    setIsAddingNewMeal(false);
    setShowMealModal(true);
  };

  const handleAddNewMealClick = () => {
    setIsAddingNewMeal(true);
    setShowMealModal(true);
  };

  const handleActivityUpdateClick = () => {
    if (residentData.activities.length === 0) {
      toast.error("No activities available to update");
      return;
    }
    setIsAddingNewActivity(false);
    setShowActivityModal(true);
  };

  const handleAddNewActivityClick = () => {
    setIsAddingNewActivity(true);
    setShowActivityModal(true);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const formatTime = (time) => {
    if (!time) return "";
    try {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return time;
    }
  };

  const formatLastUpdated = (updatedAt) => {
    const now = new Date();
    const updated = new Date(updatedAt);
    const diffInHours = Math.floor((now - updated) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const fetchResident = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        residentResponse,
        healthRecordsResponse,
        mealRecordResponse,
        activitiesRecordResponse,
      ] = await Promise.all([
        getResidents(),
        getHealthRecords(id),
        getMealRecord(id),
        getActivitiesRecord(id),
      ]);

      const resident = residentResponse.residents.find((r) => r._id === id);
      const latestHealthRecord = healthRecordsResponse.healthRecords?.[0];

      if (!resident) {
        setError("Resident not found");
        return;
      }

      setHealthRecords(healthRecordsResponse.healthRecords || []);

      if (mealRecordResponse.mealRecords) {
        setMealRecords(mealRecordResponse.mealRecords);
      } else if (mealRecordResponse.mealRecord) {
        // Backward compatibility if API still returns single record
        setMealRecords([mealRecordResponse.mealRecord].filter(Boolean));
      }

      // Safely handle activities data
      const activities = activitiesRecordResponse?.activities || [];
      setActivitiesRecords(activities);

      const transformedData = {
        id: resident._id,
        basicInfo: {
          name: resident.fullName,
          dateOfBirth: formatDate(resident.dateOfBirth),
          gender: resident.gender,
          contact: resident.contactNumber,
          email: resident.emergencyContact.email,
          joinDate: new Date(resident.createdAt).toISOString().split("T")[0],
          address: resident.address,
        },
        emergencyContact: {
          name: resident.emergencyContact.name,
          phone: resident.emergencyContact.phone,
          email: resident.emergencyContact.email,
          relation: resident.emergencyContact.relation,
        },
        health: {
          status:
            latestHealthRecord?.status ||
            (resident.status === "active" ? "Stable" : "Critical"),
          date:
            latestHealthRecord?.date || new Date().toISOString().split("T")[0],
          lastUpdated: formatLastUpdated(
            latestHealthRecord?.createdAt || resident.updatedAt
          ),
          // Update this part to handle multiple medications
          medications: latestHealthRecord?.allMedications
            ? latestHealthRecord.allMedications.map((med) => ({
                name: med.name,
                dosage: med.dosage,
                quantity: med.quantity || "",
                time: med.medicationTime,
                status: med.isMedicationTaken ? "Taken" : "Pending",
              }))
            : latestHealthRecord
            ? [
                {
                  name: latestHealthRecord.medications,
                  dosage: latestHealthRecord.dosage,
                  quantity: latestHealthRecord.quantity || "",
                  time: latestHealthRecord.medicationTime,
                  status: latestHealthRecord.isMedicationTaken
                    ? "Taken"
                    : "Pending",
                },
              ]
            : [],
          // Convert allergies to array if it's a string
          conditions: latestHealthRecord?.medicalCondition
            ? typeof latestHealthRecord.medicalCondition === "string"
              ? latestHealthRecord.medicalCondition
                  .split(",")
                  .map((c) => c.trim())
              : latestHealthRecord.medicalCondition
            : resident.conditions || [],
          // Convert allergies to array if it's a string
          allergies: latestHealthRecord?.allergies
            ? typeof latestHealthRecord.allergies === "string"
              ? latestHealthRecord.allergies.split(",").map((a) => a.trim())
              : latestHealthRecord.allergies
            : resident.allergies || [],
          assessmentNotes: latestHealthRecord?.assessment || "",
          instructions: latestHealthRecord?.instructions || "",
        },
        meals: mealRecordResponse.mealRecord
          ? {
              dietaryNeeds: mealRecordResponse.mealRecord.dietaryNeeds,
              nutritionalGoals: mealRecordResponse.mealRecord.nutritionalGoals,
              date: mealRecordResponse.mealRecord.date,
              breakfast: mealRecordResponse.mealRecord.breakfast,
              lunch: mealRecordResponse.mealRecord.lunch,
              snacks: mealRecordResponse.mealRecord.snacks,
              dinner: mealRecordResponse.mealRecord.dinner,
            }
          : {
              dietaryNeeds: "",
              nutritionalGoals: "",
              date: new Date().toISOString().split("T")[0],
              breakfast: "",
              lunch: "",
              snacks: "",
              dinner: "",
            },
        activities: activities,
      };

      setResidentData(transformedData);
    } catch (err) {
      setError(err.message || "Error fetching resident details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResident();
  }, [fetchResident]);

  const handleHealthUpdate = async (newHealthRecord) => {
    try {
      let response;

      if (isAddingNew) {
        // Create new record with medications array
        response = await createHealthRecord(id, newHealthRecord);
        toast.success("Health record added successfully");

        // Add the new record to the beginning of the array
        setHealthRecords((prevRecords) => [
          response.healthRecord,
          ...prevRecords,
        ]);
      } else {
        // For updating, find the record with matching date
        const existingRecord = healthRecords.find(
          (record) => record.date === newHealthRecord.date
        );

        if (!existingRecord) {
          toast.error("Could not find the record to update");
          return;
        }

        // Update existing record
        response = await updateHealthRecord(
          id,
          existingRecord._id,
          newHealthRecord
        );
        toast.success("Health record updated successfully");

        // Replace the updated record in the array
        setHealthRecords((prevRecords) =>
          prevRecords.map((record) =>
            record._id === existingRecord._id ? response.healthRecord : record
          )
        );
      }

      // Update the resident data to show the latest health record
      setResidentData((prev) => ({
        ...prev,
        health: {
          ...prev.health,
          status: newHealthRecord.status,
          date: newHealthRecord.date,
          lastUpdated: "Just now",
          medications: newHealthRecord.medications.map((med) => ({
            name: med.name,
            dosage: med.dosage,
            quantity: med.quantity,
            time: med.medicationTime,
            status: med.isMedicationTaken ? "Taken" : "Pending",
          })),
          conditions: Array.isArray(newHealthRecord.medicalCondition)
            ? newHealthRecord.medicalCondition
            : [newHealthRecord.medicalCondition],
          allergies: Array.isArray(newHealthRecord.allergies)
            ? newHealthRecord.allergies
            : [newHealthRecord.allergies],
          assessmentNotes: newHealthRecord.assessment,
          instructions: newHealthRecord.instructions,
        },
      }));

      setShowHealthModal(false);
    } catch (error) {
      console.error("Error managing health record:", error);
      toast.error(
        error.response?.data?.message || "Error managing health record"
      );
    }
  };

  const handleMealUpdate = async (updatedMeal) => {
    try {
      let response;

      if (isAddingNewMeal) {
        // Create new record
        response = await createMealRecord(id, updatedMeal);
        toast.success("Meal plan added successfully");

        // Add new record to the array
        setMealRecords((prevRecords) => [response.mealRecord, ...prevRecords]);
      } else {
        // For updating, find the record with matching date
        const existingRecord = mealRecords.find(
          (record) => record.date === updatedMeal.date
        );

        if (!existingRecord) {
          toast.error("Could not find the record to update");
          return;
        }

        // Update existing record
        response = await updateMealRecord(id, existingRecord._id, updatedMeal);
        toast.success("Meal plan updated successfully");

        // Update the record in the array
        setMealRecords((prevRecords) =>
          prevRecords.map((record) =>
            record._id === existingRecord._id ? response.mealRecord : record
          )
        );
      }

      setResidentData((prev) => ({
        ...prev,
        meals: {
          dietaryNeeds: response.mealRecord.dietaryNeeds,
          nutritionalGoals: response.mealRecord.nutritionalGoals,
          date: response.mealRecord.date,
          breakfast: response.mealRecord.breakfast,
          lunch: response.mealRecord.lunch,
          snacks: response.mealRecord.snacks,
          dinner: response.mealRecord.dinner,
        },
      }));

      setShowMealModal(false);
    } catch (error) {
      console.error("Error managing meal record:", error);
      toast.error(error.response?.data?.message || "Error managing meal plan");
    }
  };

  const handleActivityUpdate = async (updatedActivities) => {
    try {
      console.log("Updating Activities:", updatedActivities);

      let response;

      if (isAddingNewActivity) {
        // Create new record
        response = await createActivitiesRecord(id, updatedActivities);
        toast.success("New activity added successfully");

        const newActivity = {
          ...updatedActivities.activities[0],
          _id: response.activitiesRecord._id,
        };

        setActivitiesRecords((prevRecords) => [newActivity, ...prevRecords]);
        setResidentData((prev) => ({
          ...prev,
          activities: [newActivity, ...prev.activities],
        }));
      } else {
        // Find the activity record that matches the date we're updating
        const existingActivity = activitiesRecords.find(
          (record) => record.date === updatedActivities.activities[0].date
        );

        if (!existingActivity) {
          toast.error("Could not find the activity to update");
          return;
        }

        // Update existing record
        response = await updateActivitiesRecord(
          id,
          existingActivity._id,
          updatedActivities
        );
        toast.success("Activities updated successfully");

        const updatedActivity = {
          ...updatedActivities.activities[0],
          _id: existingActivity._id,
        };

        // Update activities records - replace old record with updated one
        setActivitiesRecords((prevRecords) => {
          return prevRecords.map((record) =>
            record._id === existingActivity._id ? updatedActivity : record
          );
        });

        // Update resident data - replace old activity with updated one
        setResidentData((prev) => ({
          ...prev,
          activities: prev.activities.map((activity) =>
            activity._id === existingActivity._id ? updatedActivity : activity
          ),
        }));
      }

      setShowActivityModal(false);
    } catch (error) {
      console.error("Full Activity Update Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error managing activities"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Sidebar activePage="residents-list" />
        <div className="ml-72 p-8 flex items-center justify-center">
          <div className="text-gray-600">Loading resident details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Sidebar activePage="residents-list" />
        <div className="ml-72 p-8 flex items-center justify-center">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar activePage="residents-list" />

      <div className="ml-72 p-8">
        {showHealthModal && (
          <HealthUpdateModal
            isOpen={showHealthModal}
            onClose={() => setShowHealthModal(false)}
            initialData={isAddingNew ? null : residentData.health}
            onSubmit={handleHealthUpdate}
            isAddingNew={isAddingNew}
            healthRecords={healthRecords}
          />
        )}
        {showMealModal && (
          <MealUpdateModal
            isOpen={showMealModal}
            onClose={() => setShowMealModal(false)}
            initialData={isAddingNewMeal ? null : residentData.meals}
            onSubmit={handleMealUpdate}
            isAddingNew={isAddingNewMeal}
            mealRecords={mealRecords}
          />
        )}
        {showActivityModal && (
          <ActivitiesUpdateModal
            isOpen={showActivityModal}
            onClose={() => setShowActivityModal(false)}
            initialData={isAddingNewActivity ? null : residentData.activities}
            onSubmit={handleActivityUpdate}
            isAddingNew={isAddingNewActivity}
            activitiesRecords={activitiesRecords}
          />
        )}
        {showHealthHistoryModal && (
          <HealthReviewModal
            isOpen={showHealthHistoryModal}
            onClose={() => setShowHealthHistoryModal(false)}
            healthRecords={healthRecords}
          />
        )}
        {showMealHistoryModal && (
          <MealReviewModal
            isOpen={showMealHistoryModal}
            onClose={() => setShowMealHistoryModal(false)}
            mealRecords={mealRecords}
          />
        )}
        {showActivitiesHistoryModal && (
          <ActivitiesReviewModal
            isOpen={showActivitiesHistoryModal}
            onClose={() => setShowActivitiesHistoryModal(false)}
            activities={residentData.activities}
          />
        )}
        {/* Header */}
        <div className="mb-8 font-[Poppins]">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Residents List
          </button>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {residentData.basicInfo.name
                    ? residentData.basicInfo.name.charAt(0)
                    : ""}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {residentData.basicInfo.name}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    residentData.health.status === "Critical"
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {residentData.health.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 font-[Poppins]">
          <div className="flex gap-2 p-1 bg-white/60 backdrop-blur-sm rounded-xl max-w-2xl">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "health", label: "Health", icon: Heart },
              { id: "meals", label: "Meal", icon: UtensilsCrossed },
              { id: "activities", label: "Activity", icon: Activity },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-white/80"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div
          className={`grid grid-cols-12 gap-6 ${
            activeTab === "overview" ? "" : ""
          }`}
        >
          {/* Main Content */}
          <div
            className={`${
              activeTab === "overview"
                ? "col-span-12"
                : "col-span-12 lg:col-span-8"
            } space-y-6`}
          >
            {activeTab === "overview" && (
              <div className="space-y-6 font-[Poppins]">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 text-cyan-500">
                        <User className="h-full w-full" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Personal Information
                        </h1>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <User className="h-5 w-5 text-cyan-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Basic Details
                        </h2>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Full Name
                            </p>
                            <p className="text-gray-600">
                              {residentData.basicInfo.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Date of Birth
                            </p>
                            <p className=" text-gray-600">
                              {residentData.basicInfo.dateOfBirth}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Gender
                            </p>
                            <p className="text-gray-600">
                              {residentData.basicInfo.gender}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <PhoneCall className="h-5 w-5 text-cyan-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Contact Information
                        </h2>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Address
                            </p>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-600" />
                              <p className="text-gray-600">
                                {residentData.basicInfo.address}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Phone
                            </p>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-600" />
                              <p className="text-gray-600">
                                {residentData.basicInfo.contact}
                              </p>
                            </div>
                          </div>
                          <div></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Emergency Contact
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-4 bg-red-50/50 rounded-lg">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Name
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-gray-600">
                                {residentData.emergencyContact.name}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Relationship
                            </p>
                            <p className="text-gray-600">
                              {residentData.emergencyContact.relation}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-red-50/50 rounded-lg">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Phone
                            </p>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-600" />
                              <p className="text-gray-600">
                                {residentData.emergencyContact.phone}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Email
                            </p>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-600" />
                              <p className="text-gray-600">
                                {residentData.emergencyContact.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Health Tab Content */}
            {activeTab === "health" && (
              <div className="space-y-6 font-[Poppins]">
                {/* Allergies and Medical Conditions Section */}
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <button
                    onClick={() =>
                      setIsMedicalProfileExpanded(!isMedicalProfileExpanded)
                    }
                    className="w-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">
                            Medical Profile
                          </h1>
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-6 w-6 text-gray-400 transition-transform duration-200 ${
                          isMedicalProfileExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Collapsible content */}
                  {isMedicalProfileExpanded && (
                    <div className="grid grid-cols-2 gap-6 mt-4 transition-all duration-200">
                      {/* Allergies */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-red-50 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Allergies
                          </h2>
                        </div>
                        <div className="space-y-2">
                          {residentData.health.allergies.length > 0 ? (
                            residentData.health.allergies.map(
                              (allergy, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 p-3 bg-red-50/50 rounded-lg"
                                >
                                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                  <span className="text-gray-600">
                                    {allergy}
                                  </span>
                                </div>
                              )
                            )
                          ) : (
                            <p className="text-gray-500">
                              No allergies recorded
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Medical Conditions */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-red-50 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Medical Conditions
                          </h2>
                        </div>
                        <div className="space-y-2">
                          {residentData.health.conditions.length > 0 ? (
                            residentData.health.conditions.map(
                              (condition, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 p-3 bg-red-50/50 rounded-lg"
                                >
                                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                  <span className="text-gray-600">
                                    {condition}
                                  </span>
                                </div>
                              )
                            )
                          ) : (
                            <p className="text-gray-500">
                              No medical conditions recorded
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Health Plan Section */}
                {!residentData.health.conditions.length ? (
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Health Records Added
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add health information using the quick actions panel.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-8 shadow-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-4">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">
                            Health Plan
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            Date:
                          </span>
                          <span className="text-gray-600">
                            {residentData.health.date || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Medication Details */}
                    <div className="border border-gray-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Pill className="h-5 w-5 text-cyan-500" />
                          </div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Medication Details
                          </h2>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            Total Medications:{" "}
                            {residentData.health.medications.length}
                          </span>
                          {/* Pagination Controls */}
                          {residentData.health.medications.length >
                            itemsPerPage && (
                            <div className="flex items-center bg-gray-50 rounded-lg p-1">
                              <button
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.max(prev - 1, 0)
                                  )
                                }
                                disabled={currentPage === 0}
                                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                              >
                                <ChevronLeft className="h-4 w-4 text-gray-600" />
                              </button>
                              <span className="px-4 py-1 text-sm text-gray-600">
                                {currentPage + 1} /{" "}
                                {Math.ceil(
                                  residentData.health.medications.length /
                                    itemsPerPage
                                )}
                              </span>
                              <button
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.min(
                                      prev + 1,
                                      Math.ceil(
                                        residentData.health.medications.length /
                                          itemsPerPage
                                      ) - 1
                                    )
                                  )
                                }
                                disabled={
                                  currentPage >=
                                  Math.ceil(
                                    residentData.health.medications.length /
                                      itemsPerPage
                                  ) -
                                    1
                                }
                                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                              >
                                <ChevronRight className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Medication Cards */}
                      <div className="grid grid-cols-1 gap-6">
                        {residentData.health.medications
                          .slice(
                            currentPage * itemsPerPage,
                            (currentPage + 1) * itemsPerPage
                          )
                          .map((med, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                            >
                              {/* Medication Header */}
                              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                      <Pill className="h-5 w-5 text-cyan-500" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900">
                                        {med.name || "No medication name"}
                                      </h3>
                                      <p className="text-sm text-gray-600">
                                        Medication{" "}
                                        {index + 1 + currentPage * itemsPerPage}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        med.status === "Taken"
                                          ? "bg-green-50 text-green-600"
                                          : "bg-yellow-50 text-yellow-600"
                                      }`}
                                    >
                                      {med.status}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Medication Details Grid */}
                              <div className="p-6">
                                <div className="grid grid-cols-3 gap-6">
                                  <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-900">
                                      Dosage
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-gray-600">
                                        {med.dosage || "Not specified"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-900">
                                      Quantity
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-gray-600">
                                        {med.quantity || "Not specified"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-900">
                                      Time
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-gray-600">
                                        {formatTime(med.time)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Health Assessment */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <FileText className="h-5 w-5 text-cyan-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Health Assessment
                        </h2>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            Assessment Notes
                          </h3>
                          <div className="p-4 bg-gray-50/80 rounded-lg border border-gray-100">
                            <p className="text-gray-600">
                              {residentData.health.assessmentNotes ||
                                "No assessment notes available."}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            Instructions
                          </h3>
                          <div className="p-4 bg-gray-50/80 rounded-lg border border-gray-100">
                            <p className="text-gray-600">
                              {residentData.health.instructions ||
                                "No instructions available."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Meals Tab Content */}
            {activeTab === "meals" && (
              <div className="space-y-6 font-[Poppins]">
                {!residentData.meals.breakfast?.length &&
                !residentData.meals.lunch?.length &&
                !residentData.meals.dinner?.length ? (
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                    <UtensilsCrossed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Meal Plan Added
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Set up the meal plan using the quick actions panel.
                    </p>
                  </div>
                ) : (
                  <MealDisplaySection mealData={residentData.meals} />
                )}
              </div>
            )}

            {activeTab === "activities" && (
              <div className="space-y-6 font-[Poppins]">
                {!residentData.activities.length ? (
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Activities Scheduled
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Schedule activities for this resident using the quick
                      actions panel.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Activity List Header */}
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 text-cyan-500">
                            <Activity className="h-full w-full" />
                          </div>
                          <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                              Activity Plan
                            </h1>
                          </div>
                        </div>
                        <div className="flex flex-col items-end"></div>
                      </div>

                      {/* Activities List */}
                      <div className="space-y-4">
                        {Array.isArray(residentData.activities) &&
                          residentData.activities.map((activity, index) => (
                            <div
                              key={activity._id || index}
                              className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 bg-cyan-50 rounded-lg flex items-center justify-center">
                                    <Activity className="h-5 w-5 text-cyan-500" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900 text-lg">
                                      {activity.name}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1 text-gray-600">
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-sm">
                                          {activity.location}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">
                                          {activity.date}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  {activity.duration && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Clock className="h-4 w-4" />
                                      <span className="text-sm">
                                        {activity.duration} mins
                                      </span>
                                    </div>
                                  )}
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      activity.status === "Completed"
                                        ? "bg-green-50 text-green-600"
                                        : activity.status === "Cancelled"
                                        ? "bg-red-50 text-red-600"
                                        : activity.status === "In Progress"
                                        ? "bg-yellow-50 text-yellow-600"
                                        : "bg-blue-50 text-blue-600"
                                    }`}
                                  >
                                    {activity.status}
                                  </span>
                                </div>
                              </div>

                              {/* Optional Description and Notes */}
                              {(activity.description || activity.notes) && (
                                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                  {activity.description && (
                                    <div className="mb-2">
                                      <h5 className="text-sm font-medium text-gray-700 mb-1">
                                        Description
                                      </h5>
                                      <p className="text-gray-600">
                                        {activity.description}
                                      </p>
                                    </div>
                                  )}
                                  {activity.notes && (
                                    <div>
                                      <h5 className="text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                      </h5>
                                      <p className="text-gray-600">
                                        {activity.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions Sidebar */}
          {activeTab !== "overview" && (
            <div className="col-span-12 lg:col-span-4 space-y-6 font-[Poppins]">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  {activeTab === "health" && (
                    <div className="space-y-3">
                      {/* Only show Update button if there are health records */}
                      {healthRecords.length > 0 ? (
                        <button
                          onClick={handleUpdateClick}
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
                      ) : (
                        <div className="w-full p-4 bg-gray-50 rounded-xl text-center">
                          <span className="text-gray-500">
                            No health records to update
                          </span>
                        </div>
                      )}

                      {/* Add New Health Record button */}
                      <button
                        onClick={handleAddNewClick}
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

                      {/* View History button */}
                      {healthRecords.length > 0 && (
                        <button
                          onClick={() => setShowHealthHistoryModal(true)}
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
                      {/* Only show Update button if there's a meal record */}
                      {mealRecords.length > 0 ? (
                        <button
                          onClick={handleMealUpdateClick}
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
                      ) : (
                        <div className="w-full p-4 bg-gray-50 rounded-xl text-center">
                          <span className="text-gray-500">
                            No meal records to update
                          </span>
                        </div>
                      )}

                      {/* Add New Meal Plan button */}
                      <button
                        onClick={handleAddNewMealClick}
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

                      {/* View History button */}
                      {mealRecords.length > 0 && (
                        <button
                          onClick={() => setShowMealHistoryModal(true)}
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
                      {/* Only show Update button if there are activities */}
                      {residentData.activities.length > 0 ? (
                        <button
                          onClick={handleActivityUpdateClick}
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
                      ) : (
                        <div className="w-full p-4 bg-gray-50 rounded-xl text-center">
                          <span className="text-gray-500">
                            No activities to update
                          </span>
                        </div>
                      )}

                      {/* Add New Activity button */}
                      <button
                        onClick={handleAddNewActivityClick}
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

                      {/* View History button */}
                      {residentData.activities.length > 0 && (
                        <button
                          onClick={() => setShowActivitiesHistoryModal(true)}
                          className="w-full flex items-center justify-between p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-cyan-500" />
                            <span className="font-medium text-cyan-700">
                              View Activitiy History
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentDetails;
