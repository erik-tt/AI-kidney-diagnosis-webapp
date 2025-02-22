import { SetStateAction, useEffect, useState } from "react";
import api from "../utils/api";
import { Patient } from "../types/types";
import PatientForm from "./PatientForm";


function PatientList() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [open, setOpen] = useState(false);
    

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        getPatients()
    };

    useEffect(() => {
        getPatients();
    }, []);

    const getPatients = () => {
        api.get("api/patients/")
            .then((res) => res.data)
            .then((data) => {
                setPatients(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    return (
        <div className="relative overflow-x-auto max-w-full mx-auto p-10">
            <h2 className="text-4xl font-semibold leading-none tracking-tight text-gray-700 md:text-2xl lg:text-4xl mb-5">
                Patient List
            </h2>
            <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 drop-shadow-md bg-gray-50">
                <thead className="text-xs text-gray-700 uppercase  dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Last name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            First name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Gender
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date of birth
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient: Patient) => (
                        <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-6 py-4">{patient.last_name}</td>
                            <td className="px-6 py-4">{patient.first_name}</td>
                            <td className="px-6 py-4">{patient.gender}</td>
                            <td className="px-6 py-4">
                                {patient.date_of_birth}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        
            <button
                onClick={handleClickOpen}
                className="mt-2 rounded-md cursor-pointer drop-shadow-md bg-gray-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                type="submit"
            >
                Register New Patient
            </button>
            <PatientForm open={open} onClose={handleClose} />
        </div>
    );
}

export default PatientList;
