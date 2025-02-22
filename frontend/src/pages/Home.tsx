import { useState } from "react";
import Header from "../components/Header";
import PatientForm from "../components/PatientForm";
import PatientList from "../components/PatientList";
import Sidebar from "../components/Sidebar";

function Home() {

    return (
        <div>
            <PatientList/>
        </div>
    );
}

export default Home;
