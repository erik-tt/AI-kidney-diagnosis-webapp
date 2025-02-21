import { useState } from "react";
import api from "../utils/api";

function PatientForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("F");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();

        const payload = {
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            date_of_birth: dateOfBirth
          };

        try {
            const res = await api.post("api/patients/create", payload);
            if (res.status === 201) {
                alert("Registered new patient");
            } else alert("failed to register");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 space-y-4 max-w-md mx-auto bg-white rounded-xl drop-shadow-sm mt-10">
            <h2 className="font-semibold">Register New Patient</h2>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <label>First name</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-gray-100 outline-1 p-1 rounded-xl mb-5"
                />
                <label>Last name</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-gray-100 outline-1 p-1 rounded-xl mb-5"
                />
                <label>Gender</label>
                <select
                    className="bg-gray-100 outline-1 p-1 rounded-xl mb-5"
                    value = {gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="F">Female</option>
                    <option value="M">Male</option>
                </select>
                <label>Date of birth</label>
                <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="bg-gray-100 outline-1 p-1 rounded-xl mb-5"
                />
                <button
                    className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    type="submit"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default PatientForm;
