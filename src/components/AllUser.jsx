import React, { useState } from 'react'
import { HiChevronDoubleDown, HiChevronDoubleUp } from 'react-icons/hi2';

const AllUser = ({ users }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="mt-5 rounded-md shadow-md text-white pt-4">
            <button onClick={() => { setOpen(!open) }} className="w-full">
                <div className="w-full bg-[#363740] p-3 mb-4 flex flex-row items-center justify-between rounded-md">
                    <h2 className="text-md md:text-2xl font-semibold text-white">Agency Staff</h2>
                    {!open ? (
                        <button onClick={() => { setOpen(!open) }}>
                            <HiChevronDoubleDown size={20} color="cyan" className="mr-2 md:mr-8" />
                        </button>
                    ) : (
                        <button onClick={() => { setOpen(!open) }}>
                            <HiChevronDoubleUp size={20} color="cyan" className="mr-2 md:mr-8" />
                        </button>
                    )}
                </div>
            </button>


            {/* table */}
            {
                open &&
                (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-700 text-sm">
                            <thead>
                                <tr className="bg-gray-800">
                                    <th className="border border-gray-700 px-4 py-2">AgencyNo</th>
                                    <th className="border border-gray-700 px-4 py-2">Name</th>
                                    <th className="border border-gray-700 px-4 py-2">Mobile</th>
                                    <th className="border border-gray-700 px-4 py-2">CenterName</th>
                                    <th className="border border-gray-700 px-4 py-2">Last_Login</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.map((entry, index) => (
                                        <tr key={index} className="bg-gray-700 hover:bg-gray-600 transition-colors">
                                            <td className="border border-gray-600 px-4 py-2 text-center">{entry.agencyNo || "-"}</td>
                                            <td className="border border-gray-600 px-4 py-2 text-center">{entry.name || "-"}</td>
                                            <td className="border border-gray-600 px-4 py-2 text-center">{entry.mobile || "-"}</td>
                                            <td className="border border-gray-600 px-4 py-2 text-center">{entry.centerName || "-"}</td>
                                            <td className="border border-gray-600 px-4 py-2 text-center">
                                                {new Date(entry.last_login_date).toLocaleDateString('en-GB')}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div>
    )
}

export default AllUser
