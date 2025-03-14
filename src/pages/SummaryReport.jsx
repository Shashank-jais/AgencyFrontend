import React, { useState } from 'react'
import PassbookReport from '../components/PassbookReport ';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const SummaryReport = () => {
    const agencyMapping = {
        "123": "Polytechnic",
        "124": "Indira Nagar",
        "1": "Gomti Nagar"
    };

    const [sampleData, setsampleData] = useState({
        agencyData: [],
        agencyDifferenceData: [],
    });
    const user = useSelector((state) => state?.user)

    const [data, setData] = useState({
        agencyId: '',
        month: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateValue = Object.values(data).every((el) => el);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateValue) {
            toast.error("Please fill all fields");
            return;
        }
        if (user.agencyNo != 101 && data.agencyId != user.agencyNo) {
            toast.error("Wrong CenterID!");
            return;
        }

        try {
            const response = await fetch(SummaryApi.recordbyagencyid.url, {
                method: SummaryApi.recordbyagencyid.method,
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const result = await response.json();
            if (result.error) {
                toast.error(result.message);
                return;
            }

            if (result.success && result.agencyData && result.agencyDifferenceData) {
                toast.success("Data fetched successfully");

                // Format agencyData
                const formattedAgencyData = result.agencyData.map((item) => ({
                    ...item,
                    date: item.date.split("T")[0],
                }));

                // Format agencyDifferenceData
                const formattedAgencyDifferenceData = result.agencyDifferenceData.map((item) => ({
                    ...item,
                    date: item.date.split("T")[0],
                    amount: parseFloat(item.amount.toFixed(2)),
                    difference: parseFloat(item.difference.toFixed(2)),
                }));

                // Set the formatted data to sampleData
                setsampleData({
                    agencyData: formattedAgencyData,
                    agencyDifferenceData: formattedAgencyDifferenceData,
                });
            } else {
                toast.error("Invalid data format received from the server.");
            }


        } catch (error) {

            toast.error("An error occurred. Please try again.");
            console.error(error);

        }
    }


    const exportFullReport = (data, fileName) => {
        if (!data.agencyData.length && !data.agencyDifferenceData.length) {
            toast.error("No data available to export!");
            return;
        }

        const wb = XLSX.utils.book_new();

        // Convert each dataset into a sheet
        const agencySheet = XLSX.utils.json_to_sheet(data.agencyData);
        const diffSheet = XLSX.utils.json_to_sheet(data.agencyDifferenceData);

        // Append sheets
        XLSX.utils.book_append_sheet(
            wb,
            agencySheet,
            `${data.agencyId && agencyMapping[String(data.agencyId)] ? agencyMapping[String(data.agencyId)] : "Agency"} Bill Report`
        );

        XLSX.utils.book_append_sheet(
            wb,
            diffSheet,
            `${data.agencyId && agencyMapping[String(data.agencyId)] ? agencyMapping[String(data.agencyId)] : " Agency"} Difference Data`
        );


        // Create Excel file and download
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `${fileName}.xlsx`);
    };











    return (
        <div className="bg-backBackground md:pt-6 pt-10 w-full h-full overflow-y-auto">
            <header>
                <div className="mb-8">
                    <h1 className="text-white font-bold text-4xl">Summary</h1>
                </div>
            </header>


            {/* Form for the agency no  */}
            <form className='grid  grid-cols-1 md:grid-rows-1 md:grid-cols-3 gap-5' onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label htmlFor="centerID" className="text-gray-400 text-md md:w-24">CenterID</label>
                    <input
                        type="number"
                        id="centerID"
                        name="agencyId"
                        value={data['agencyId']}
                        placeholder="centerID"
                        required
                        onChange={handleChange}
                        className="p-2 bg-gray-700 rounded-md text-white w-full"
                    />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2   ">
                    <label htmlFor="month" className="text-gray-400 text-md md:w-24">Month</label>
                    <input
                        type="text"
                        id="month"
                        name="month"
                        value={data['month']}
                        placeholder="month"
                        required
                        onChange={handleChange}
                        className="p-2 bg-gray-700 rounded-md text-white w-full"
                    />
                </div>
                <div className="flex flex-row items-center gap-10 justify-center   ">
                    <button
                        type="submit"
                        disabled={!validateValue}
                        className={`w-[40%] p-2 rounded-md font-medium ${validateValue ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 cursor-not-allowed"}`}
                    >
                        Fetch
                    </button>
                    <button
                        disabled={!sampleData.agencyData.length && !sampleData.agencyDifferenceData.length}
                        onClick={() => exportFullReport(sampleData, "Summary_Report")}
                        className={` w-[40%] p-2 rounded-md font-medium ${sampleData.agencyData.length || sampleData.agencyDifferenceData.length ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 cursor-not-allowed"}`}
                    >
                        📥 Download
                    </button>

                </div>
            </form>


            {/* Passbook */}
            <PassbookReport agencyData={sampleData.agencyData} agencyDifferenceData={sampleData.agencyDifferenceData} agencyNo={data.agencyId} />


        </div>
    )
}

export default SummaryReport
