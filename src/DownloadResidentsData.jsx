import { Download } from "lucide-react";
import PropTypes from "prop-types";

const DownloadResidentsData = ({ residents }) => {
  const downloadResidentsData = () => {
    const headers = [
      "Name",
      "Date of Birth",
      "Gender",
      "Address",
      "Contact",
      "Join Date",
      "Emergency Contact Name",
      "Emergency Contact Relation",
      "Emergency Contact Phone",
      "Emergency Contact Email",
      "Health Status",
      "Last Updated",
    ];

    const csvData = residents.map((resident) => [
      resident.basicInfo.name,
      resident.basicInfo.dateOfBirth,
      resident.basicInfo.gender,
      resident.basicInfo.address,
      resident.basicInfo.contact,
      resident.basicInfo.joinDate,
      resident.emergencyContact.name,
      resident.emergencyContact.relation,
      resident.emergencyContact.phone,
      resident.emergencyContact.email,
      resident.health.status,
      resident.health.lastUpdated,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `residents_list_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadResidentsData}
      className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2"
      title="Download residents list"
    >
      <Download className="h-5 w-5" />
      <span className="sr-only">Download residents list</span>
    </button>
  );
};

DownloadResidentsData.propTypes = {
  residents: PropTypes.arrayOf(
    PropTypes.shape({
      basicInfo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        dateOfBirth: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        contact: PropTypes.string.isRequired,
        joinDate: PropTypes.string.isRequired,
      }).isRequired,
      emergencyContact: PropTypes.shape({
        name: PropTypes.string.isRequired,
        relation: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      }).isRequired,
      health: PropTypes.shape({
        status: PropTypes.string.isRequired,
        lastUpdated: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default DownloadResidentsData;
