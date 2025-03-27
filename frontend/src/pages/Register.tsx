import { useState, useEffect } from "react";
import api from "../utils/api";
import { Link, useNavigate } from 'react-router';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function Register() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();

        try {
            await api.post("api/user/register/", {
                username,
                password,
            });
            navigate("/login");
        } catch (error) {
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center w-96 p-8 rounded-xl sm:shadow-lg mx-auto mt-20">
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
                {loading ?
                <Button disabled className="mt-2 shadow w-full">
                    <Loader2 className="animate-spin" />
                    Loading...
                </Button> :
                <Button className="mt-2 shadow w-full" type="submit">
                    Register
                </Button>}
            </form>
            {isError && (
                <div className="mt-2">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Please try another username.
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            <p className="mt-10 text-center text-sm/6 text-gray-500">
                Already have an account?
                <Link
                    to="/login"
                    className="font-semibold text-gray-600 hover:text-gray-500"
                >
                    {" "}
                    Login
                </Link>
            </p>
            <div className="mt-2 text-sm  text-center  tracking-tight text-gray-500">
                <p className="font-bold text-red-600 ">Disclaimer: </p>
                <p>
                    This site is a research project. Do not upload personal
                    health information data to this site!{" "}
                </p>
            </div>
        </div>
    );
}

export default Register;
