import { useEffect, useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    //const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        //setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post("api/user/register/", {
                username,
                password,
            });
            navigate("/login");
            if (res.status != 201) {
                alert("failed to register user")
            }
        } catch (error) {
            alert(error);
        } finally {
            //setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center w-96 p-8 rounded-xl sm:shadow-lg mx-auto mt-20 bg-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Register
                </h1>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm/6 font-medium text-gray-900">
                        Username
                    </label>
                    <input
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm/6"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm/6 font-medium text-gray-900">
                        Password
                    </label>
                    <input
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm/6"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    type="submit"
                >
                    Register
                </button>
            </form>
            <p className="mt-10 text-center text-sm/6 text-gray-500">
                Already have an account?
                <Link to="/login"
                    className="font-semibold text-gray-600 hover:text-gray-500"
                >
                    {" "}
                    Login
                </Link>
            </p>
            <div className="mt-2 text-sm  text-center  tracking-tight text-gray-500">
                    <p className="font-bold text-red-600 ">Disclaimer: </p>
                    <p>This site is a research project. Do not upload personal health information data to this site! </p>
            </div>
        </div>
    );
}

export default Register;
