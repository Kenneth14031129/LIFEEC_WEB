import { Download } from "lucide-react";
import PropTypes from "prop-types";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DownloadResidentsData = ({ residents }) => {
  const downloadResidentsList = () => {
    const doc = new jsPDF();

    // Add title
    const title = `Residents List - ${new Date().toLocaleDateString()}`;
    doc.setFontSize(16);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, {
      align: "center",
    });

    // Define table headers
    const headers = [
      "Name",
      "DOB",
      "Gender",
      "Address",
      "Contact",
      "Emergency Contact",
      "Health Status",
      "Last Updated",
    ];

    // Prepare table data
    const data = residents.map((resident) => [
      resident.basicInfo.name,
      resident.basicInfo.dateOfBirth,
      resident.basicInfo.gender,
      resident.basicInfo.address,
      resident.basicInfo.contact,
      `${resident.emergencyContact.name} (${resident.emergencyContact.relation})`,
      resident.health.status,
      resident.health.lastUpdated,
    ]);

    // Generate table
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 25,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { top: 25 },
      theme: "grid",
    });

    // Add footer with date
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        `Generated on ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    // Save the PDF
    doc.save(`residents_list_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <button
      onClick={downloadResidentsList}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
      title="Download residents list as PDF"
    >
      <Download className="h-5 w-5" />
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
      }).isRequired,
      emergencyContact: PropTypes.shape({
        name: PropTypes.string.isRequired,
        relation: PropTypes.string.isRequired,
      }).isRequired,
      health: PropTypes.shape({
        status: PropTypes.string.isRequired,
        lastUpdated: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default DownloadResidentsData;
