import { useNavigate } from "react-router";

function Header() {
    const navigate = useNavigate()

    const Logout = () => {
        navigate("/logout")
    }

    return (
        <header className="bg-white p-4 border-b">
        <nav className="flex justify-between">
            <div className="flex">
            <p className="font-semibold">Kidney Function &nbsp;</p><p>Diagnosis Assistant</p>
            </div> 
            <button type="button" className="hover:text-gray-600 cursor-pointer"
                onClick={() => Logout()}
            >
                Log out
            </button>
        </nav>
        </header>
    );
    };

export default Header;