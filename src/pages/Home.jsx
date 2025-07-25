import React, { useEffect, useState } from 'react';
import { FaRedo } from 'react-icons/fa';
import { FaBoxOpen } from "react-icons/fa";
import { GoArrowSwitch } from "react-icons/go";
import { FaPercentage } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { FaBalanceScale } from "react-icons/fa";
import { FaCalculator } from "react-icons/fa";
import SummaryApi from '../common/SummaryApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaSpinner } from "react-icons/fa";


const Home = () => {

  const user = useSelector((state) => state?.user)
  const [loading, setLoading] = useState(false);
  const agencyMapping = {
    "102": "Polytechnic",
    "124": "Indira Nagar",
    "1": "Gomti Nagar"
  };
  const [agencyData, setAgencyData] = useState([]);
  const [totalLoading, setTotalLoading] = useState(false);




  const [data, setData] = useState({
    center: "",
    date: "",
    supply: "",
    cutrate: "",
    return: "",
    bhariye: "",
    new: "",
    page: ""
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
    if (user.agencyNo != 101 && data.center != user.agencyNo) {
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


      const response = await fetch(SummaryApi.addRecord.url, {
        method: SummaryApi.addRecord.method,
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
        toast.success("Record Saved Sucessfully");
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

    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  }



  const fetchTotalDetails = async () => {
    setTotalLoading(true);
    try {
      const response = await fetch(SummaryApi.totalDetails.url, {
        method: SummaryApi.totalDetails.method,
        credentials: "include",
      })

      const dataApi = await response.json();

      if (dataApi.error) {
        toast.error(result.message);
        return;
      }

      if (dataApi.success) {
        setTotalLoading(false);
        setAgencyData(dataApi.agencyTotals)
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  }

  useEffect(() => {
    {
      if (user.role === 'ADMIN') {
        fetchTotalDetails()
      }
    }
  }, [])


  return (
    <div className="bg-backBackground md:pt-6 pt-10 w-full h-full overflow-y-auto mb-60 md:mb-0">
      {loading ? (
        <div className="bg-[#363740] bg-opacity-50 p-6 rounded-xl shadow-md w-full max-w-full h-full flex items-center justify-center">
          <FaSpinner className="animate-spin text-green-500 text-3xl" />
          <span className='text-green-500 m-2 text-xl'>Saving Data</span>
        </div>
      ) :
        (<>
          <header>
            <div className="mb-8">
              <h1 className="text-white font-bold text-4xl">Overview</h1>
            </div>
          </header>
          <div className="flex w-full mb-5">


            <div className="bg-[#363740] p-6 rounded-xl shadow-md w-full max-w-full">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-3xl font-semibold text-white">DayBook</h1>
                  <h3 className="text-sm font-light text-gray-400">Agency business log</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setData({
                    center: "",
                    date: "",
                    supply: "",
                    cutrate: "",
                    return: "",
                    bhariye: "",
                    new: "",
                    page: ""
                  })}
                  className="p-2 text-gray-400 hover:text-white rounded"
                >
                  <FaRedo className="inline-block mr-1" size={10} /> Reset
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
                  <div key={id} className="flex flex-col md:flex-row md:items-center gap-2">
                    <label htmlFor={id} className="text-gray-400 text-sm md:w-24">{label}</label>
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
          {/* <div className='grid md:grid-cols-3 grid-cols-1 gap-9 w-full mt-3  '>
            <div className='min-h-full rounded-xl bg-[#363740] p-5'>
              <div className='flex justify-center items-center mb-2 '>
                <h2 className="text-xl font-bold text-white">Polytechnic</h2>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaBoxOpen size={20} color='cyan' />
                    <div><p className=' text-white'>Supply</p></div>
                  </div>
                  <div>
                    <p className=' text-[#40B66F]'>5000000</p>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <GoArrowSwitch size={20} color='cyan' />
                    <div><p className=' text-white'>Return</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaPercentage size={20} color='cyan' />
                    <div><p className=' text-white'>Cutrate</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div><div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaTruck size={20} color='cyan' />
                    <div><p className=' text-white'>Bhariye</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div><div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaBalanceScale size={20} color='cyan' />
                    <div><p className=' text-white'> Difference</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div>
                <hr className='text-white mt-4 mb-4' />
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaCalculator size={20} color='cyan' />
                    <div><p className=' text-white'>Total</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div>
              </div>

            </div>
            <div className='min-h-full rounded-xl bg-[#363740] p-5'>
              <div className='flex justify-center items-center mb-2 '>
                <h2 className="text-xl font-bold text-white">Polytechnic</h2>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaBoxOpen size={20} color='cyan' />
                    <div><p className=' text-white'>Supply</p></div>
                  </div>
                  <div>
                    <p className=' text-[#40B66F]'>5000000</p>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <GoArrowSwitch size={20} color='cyan' />
                    <div><p className=' text-white'>Return</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaPercentage size={20} color='cyan' />
                    <div><p className=' text-white'>Cutrate</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div><div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaTruck size={20} color='cyan' />
                    <div><p className=' text-white'>Bhariye</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div><div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaBalanceScale size={20} color='cyan' />
                    <div><p className=' text-white'> Difference</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div>
                <hr className='text-white mt-4 mb-4' />
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaCalculator size={20} color='cyan' />
                    <div><p className=' text-white'>Total</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div>
              </div>

            </div>
            <div className='min-h-full rounded-xl bg-[#363740] p-5'>
              <div className='flex justify-center items-center mb-2 '>
                <h2 className="text-xl font-bold text-white">Polytechnic</h2>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaBoxOpen size={20} color='cyan' />
                    <div><p className=' text-white'>Supply</p></div>
                  </div>
                  <div>
                    <p className=' text-[#40B66F]'>5000000</p>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <GoArrowSwitch size={20} color='cyan' />
                    <div><p className=' text-white'>Return</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaPercentage size={20} color='cyan' />
                    <div><p className=' text-white'>Cutrate</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div><div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaTruck size={20} color='cyan' />
                    <div><p className=' text-white'>Bhariye</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div><div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaBalanceScale size={20} color='cyan' />
                    <div><p className=' text-white'> Difference</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div>
                <hr className='text-white mt-4 mb-4' />
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-2'>
                    <FaCalculator size={20} color='cyan' />
                    <div><p className=' text-white'>Total</p></div>
                  </div>
                  <div>
                    <p className=' text-[#C75F62]'>5000000</p>
                  </div>
                </div>
              </div>

            </div>

          </div> */}


          <div className='grid md:grid-cols-3 grid-cols-1 gap-9 w-full mt-3 '>
            {agencyData.map((agency) => (
              <div key={agency.agencyId} className='min-h-full rounded-xl bg-[#363740] p-5'>
                <div className='flex justify-center items-center mb-2'>
                  <h2 className="text-xl font-bold text-white">
                    {agencyMapping[agency.agencyId] || `Agency ${agency.agencyId}`}
                  </h2>
                </div>
                <div className='space-y-3'>
                  <InfoRow icon={<FaBoxOpen size={20} color='cyan' />} label="Supply" value={agency.totalSupply} loading={totalLoading} color="text-[#40B66F]" />
                  <InfoRow icon={<GoArrowSwitch size={20} color='cyan' />} label="Return" value={agency.totalReturn} loading={totalLoading} color="text-[#C75F62]" />
                  <InfoRow icon={<FaPercentage size={20} color='cyan' />} label="Cutrate" value={agency.totalCutrate} loading={totalLoading} color="text-[#C75F62]" />
                  <InfoRow icon={<FaTruck size={20} color='cyan' />} label="Bhariye" value={agency.totalBhariye} loading={totalLoading} color="text-[#C75F62]" />
                  <InfoRow icon={<FaBalanceScale size={20} color='cyan' />} label="Difference" value={agency.totalDifference} loading={totalLoading} color="text-[#C75F62]" />
                  <hr className='text-white mt-4 mb-4' />
                  <InfoRow icon={<FaCalculator size={20} color='cyan' />} label="Total" value={agency.totalSupply - agency.totalReturn} loading={totalLoading} color="text-[#C75F62]" />
                </div>
              </div>
            ))}
          </div>
        </>)
      }
    </div>
  );
};


const InfoRow = ({ icon, label, value, loading, color }) => (
  <div className='flex justify-between'>
    <div className='flex items-center space-x-2'>
      {icon}
      <p className='text-white'>{label}</p>
    </div>
    {loading ? (
      <div className='w-12 h-5 bg-gray-500 animate-pulse rounded-md'></div>
    ) : (
      <p className={color}>{value}</p>
    )}
  </div>
);

export default Home;