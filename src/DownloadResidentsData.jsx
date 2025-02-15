import { Download } from "lucide-react";
import PropTypes from "prop-types";
import html2canvas from "html2canvas";

const DownloadResidentsData = ({ residents }) => {
  const downloadResidentsList = async () => {
    // Create a temporary container for rendering
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "-9999px";
    container.style.width = "800px";
    container.style.padding = "20px";
    container.style.backgroundColor = "white";
    container.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
    container.style.fontFamily = "Arial, sans-serif";

    // Create table
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    // Table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
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

    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      th.style.border = "1px solid #ddd";
      th.style.padding = "8px";
      th.style.backgroundColor = "#f2f2f2";
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement("tbody");
    residents.forEach((resident) => {
      const row = document.createElement("tr");
      [
        resident.basicInfo.name,
        resident.basicInfo.dateOfBirth,
        resident.basicInfo.gender,
        resident.basicInfo.address,
        resident.basicInfo.contact,
        `${resident.emergencyContact.name} (${resident.emergencyContact.relation})`,
        resident.health.status,
        resident.health.lastUpdated,
      ].forEach((cellText) => {
        const td = document.createElement("td");
        td.textContent = cellText;
        td.style.border = "1px solid #ddd";
        td.style.padding = "8px";
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Add title
    const title = document.createElement("h1");
    title.textContent = `Residents List - ${new Date().toLocaleDateString()}`;
    title.style.textAlign = "center";
    title.style.marginBottom = "20px";

    container.appendChild(title);
    container.appendChild(table);
    document.body.appendChild(container);

    try {
      // Use html2canvas to convert to image
      const canvas = await html2canvas(container, {
        scale: 2, // Increase resolution
        useCORS: true,
        logging: false,
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        // Create download link
        const link = document.createElement("a");
        link.download = `residents_list_${
          new Date().toISOString().split("T")[0]
        }.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
      });
    } catch (error) {
      console.error("Error downloading residents list:", error);
      alert("Failed to download residents list");
    } finally {
      // Clean up
      document.body.removeChild(container);
    }
  };

  return (
    <button
      onClick={downloadResidentsList}
      className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2"
      title="Download residents list as PNG"
    >
      <Download className="h-5 w-5" />
      <span className="sr-only">Download residents list as PNG</span>
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
