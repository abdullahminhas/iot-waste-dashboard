// App.js
"use client";
import React, { useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PDFDocument from "@/components/PDFDocument";

const generateReport = () => {
  const [pdfData, setPdfData] = useState("");

  const generatePDF = () => {
    const data = "This is some sample text for the PDF";
    setPdfData(data);
  };

  return (
    <div>
      <button onClick={generatePDF}>Generate PDF</button>
      <PDFViewer width="600" height="800">
        <PDFDocument data={pdfData} />
      </PDFViewer>
    </div>
  );
};

export default generateReport;
