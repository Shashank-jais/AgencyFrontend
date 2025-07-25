import React, { useState } from "react";
import { FaRedo, FaSpinner } from "react-icons/fa";
import { HiChevronDoubleDown } from "react-icons/hi2";
import { HiChevronDoubleUp } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import SummaryApi from "../common/SummaryApi";
import { useSelector } from "react-redux";
import toast from 'react-hot-toast';

const PassbookReport = ({ agencyNo, agencyData, agencyDifferenceData }) => {
  const user = useSelector((state) => state?.user)
  const [agencyOpen, setAgencyOpen] = useState(false);
  const [agencyDiffopen, setAgencyDiffopen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    center: "",
    date: "",
    supply: "",
    cutrate: "",
    return: "",
    bhariye: "",
    new: "",
    page: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validateValue = Object.values(data).every((el) => el);

  const agencyMapping = {
    "102": "Polytechnic",
    "124": "Indira Nagar",
    "1": "Gomti Nagar"
  };
  const combinedData = agencyData?.map((agency) => {
    const matchingDiff = agencyDifferenceData.find(
      (diff) => new Date(diff.date).toISOString() === new Date(agency.date).toISOString()
    );
    return {
      ...agency,
      ...(matchingDiff || {}),
    };
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateValue) {
      toast.error("Please fill all fields");
      return;
    }
    if (user.agencyNo != 1 && data.center != user.agencyNo) {
      toast.error("Wrong CenterID!");
      return;
    }



    const transformData = {
      agencyId: data.center,
      agencyData: {
        date: data.date,
        supply: Number(data.supply),
        return: Number(data.return),
        cutrate: Number(data.cutrate),
        bhariye: Number(data.bhariye)
      },
      agencyDifferenceData: {
        date: data.date,
        newSupply: Number(data.new),
        page: Number(data.page),
        rate: 24.5
      }
    };
    // console.log(transformData)
    try {

      setLoading(true);


      const response = await fetch(SummaryApi.updaterecord.url, {
        method: SummaryApi.updaterecord.method,
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformData),
      })

      const result = await response.json();
      // console.log(result);

      setLoading(false);

      if (result.error) {
        toast.error(result.message);
        return;
      }
      if (result.success) {
        toast.success("Record Updated Sucessfully");
        setData({
          center: "",
          date: "",
          supply: "",
          cutrate: "",
          return: "",
          bhariye: "",
          new: "",
          page: ""
        })
      }
      setShowPopup(false);

    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  }

  const handleUpdate = (entry) => {
    if (!data) {
      toast.error("An error occurred. Please try again.");
    }
    setShowPopup(true)
    setData(
      {
        center: agencyNo,
        date: entry.date,
        supply: entry.supply,
        cutrate: entry.cutrate?.toFixed(2),
        return: entry.return,
        bhariye: entry.bhariye?.toFixed(2),
        new: entry.newSupply,
        page: entry.page
      }
    )
  }

  return (
    <>
      <div className="mt-5 rounded-md shadow-lg text-white p-4">
        {/* Agency Bill Report Section */}
        <button onClick={() => { setAgencyOpen(!agencyOpen) }} className="w-full">
          <div className="w-full bg-[#363740] p-3 mb-4 flex flex-row items-center justify-between rounded-md">
            <h2 className="text-lg md:text-2xl font-bold">{`${agencyNo ? agencyMapping[agencyNo] : "Agency"} Bill Report`}</h2>
            {!agencyOpen ? (
              <button onClick={() => { setAgencyOpen(!agencyOpen) }}>
                <HiChevronDoubleDown size={20} color="cyan" className="mr-2 md:mr-8" />
              </button>
            ) : (
              <button onClick={() => { setAgencyOpen(!agencyOpen) }}>
                <HiChevronDoubleUp size={20} color="cyan" className="mr-2 md:mr-8" />
              </button>
            )}
          </div>
        </button>
        {agencyOpen && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 text-sm">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 px-4 py-2">Date</th>
                  <th className="border border-gray-700 px-4 py-2">Supply</th>
                  <th className="border border-gray-700 px-4 py-2">Return</th>
                  <th className="border border-gray-700 px-4 py-2">Cutrate</th>
                  <th className="border border-gray-700 px-4 py-2">Bhariye</th>
                  <th className="border border-gray-700 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {combinedData.map((entry, index) => (
                  <tr key={index} className="bg-gray-700 hover:bg-gray-600 transition-colors">
                    <td className="border border-gray-600 px-4 py-2 text-center">
                      {new Date(entry.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="border border-gray-600 px-4 py-2 text-center">{entry.supply || "-"}</td>
                    <td className="border border-gray-600 px-4 py-2 text-center">{entry.return || "-"}</td>
                    <td className="border border-gray-600 px-4 py-2 text-center">{entry.cutrate?.toFixed(2) || "-"}</td>
                    <td className="border border-gray-600 px-4 py-2 text-center">{entry.bhariye?.toFixed(2) || "-"}</td>
                    <td className="border border-gray-600 px-4 py-2 text-center">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors" onClick={() => { handleUpdate(entry) }}>
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Agency Difference Report Section */}
        <button onClick={() => { setAgencyDiffopen(!agencyDiffopen) }} className="w-full">
          <div className="w-full bg-[#363740] p-3 mt-8 mb-4 flex flex-row items-center justify-between rounded-md">
            <h2 className="text-lg md:text-2xl font-bold">{`${agencyNo ? agencyMapping[agencyNo] : "Agency"} Difference Report`}</h2>
            {!agencyDiffopen ? (
              <button onClick={() => { setAgencyDiffopen(!agencyDiffopen) }}>
                <HiChevronDoubleDown size={20} color="cyan" className="mr-2 md:mr-8" />
              </button>
            ) : (
              <button onClick={() => { setAgencyDiffopen(!agencyDiffopen) }}>
                <HiChevronDoubleUp size={20} color="cyan" className="mr-2 md:mr-8" />
              </button>
            )}
          </div>
        </button>

        {agencyDiffopen && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 text-sm">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 px-4 py-2">Date</th>
                  <th className="border border-gray-700 px-4 py-2">New Supply</th>
                  <th className="border border-gray-700 px-4 py-2">Page</th>
                  <th className="border border-gray-700 px-4 py-2">Weight</th>
                  <th className="border border-gray-700 px-4 py-2">Total Weight</th>
                  <th className="border border-gray-700 px-4 py-2">Rate</th>
                  <th className="border border-gray-700 px-4 py-2">Value</th>
                  <th className="border border-gray-700 px-4 py-2">Amount</th>
                  <th className="border border-gray-700 px-4 py-2">Difference</th>
                  <th className="border border-gray-700 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {combinedData.map((entry, index) => (
                  <tr key={index} className="bg-gray-700 hover:bg-gray-600 transition-colors">
                    <td className="border border-gray-600 px-4 py-2 text-center">
                      {new Date(entry.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="border border-gray-600 px-4 py-2 text-center">{entry.newSupply || "-"}</td>
                    <td className="border border-gray-600 px-4 py-2 text-center">{entry.page || "-"}</td>
                    <td className="border border-gray-600 px-4 py-2 text-center">{entry.weight?.toFixed(2) || "-"}</td>
                    <td className="border border-gray-600 px-4 py-2 text-center">{entry.totalWeight?.toFixed(2) || "-"}</td>
                    <td className="border border-gray-600 px-4 py-2 text-center">{entry.rate?.toFixed(2) || "-"}</td>
                    <td className="border border-gray-600 px-4 py-2 text-center">{entry.value?.toFixed(2) || "-"}</td>
                    <td className="border border-gray-600 px-4 py-2 text-center">{entry.amount?.toFixed(2) || "-"}</td>
                    <td className="border border-gray-600 px-4 py-2 text-center">{entry.difference?.toFixed(2) || "-"}</td>
                    <td className="border border-gray-600 px-4 py-2 text-center">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors" onClick={() => { handleUpdate(entry) }}>
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showPopup && (
          loading ? (
            <div className="fixed inset-0 flex items-center justify-center backdrop-invert backdrop-opacity-20 z-50">
              <div className="bg-[#363740] bg-opacity-50 p-6 rounded-xl shadow-md w-full max-w-full h-full flex items-center justify-center">
                <FaSpinner className="animate-spin text-green-500 text-3xl" />
                <span className='text-green-500 m-2 text-xl'>Saving Data</span>
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 flex items-center justify-center backdrop-invert backdrop-opacity-20 z-50 pt-15 md:pt-0">
              <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-fit text-center">
                <div className="flex w-full mb-5">
                  <div className="bg-[#363740] p-4 md:p-6 rounded-xl shadow-md w-full max-w-full">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h1 className="text-xl md:text-2xl font-semibold text-white">DayBook</h1>
                      </div>
                      <button
                        onClick={() => setShowPopup(false)}
                        className="mt-4 p-2 pr-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        <IoMdClose />
                      </button>
                    </div>

                    {/* Responsive Form */}
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
                      {[
                        { label: "Center", id: "center" },
                        { label: "Date", id: "date", type: "date" },
                        { label: "Supply", id: "supply" },
                        { label: "Return", id: "return" },
                        { label: "Cutrate", id: "cutrate" },
                        { label: "Bhariye", id: "bhariye" },
                        { label: "New", id: "new" },
                        { label: "Page", id: "page" },
                      ].map(({ label, id, type = "text" }) => (
                        <div key={id} className="flex flex-row md:flex-row items-center gap-2">
                          <label htmlFor={id} className="text-gray-400 text-sm w-24">{label}</label>
                          <input
                            type={type}
                            id={id}
                            name={id}
                            value={data[id]}
                            placeholder={label}
                            required
                            onChange={handleChange}
                            className="p-2 bg-gray-700 rounded-md text-white w-full"
                          />
                        </div>
                      ))}
                      <button
                        type="submit"
                        disabled={!validateValue}
                        className={`w-full p-3 rounded-md font-medium ${validateValue ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 cursor-not-allowed"}`}
                      >
                        Save
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default PassbookReport;