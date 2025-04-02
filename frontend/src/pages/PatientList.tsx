import { useEffect, useState } from "react";
import api from "../utils/api";
import { Patient } from "../types/types";
import PatientForm from "../components/PatientForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "../components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { PatientTable } from "@/components/PatientsTable";
import { columns } from "@/components/Columns";
import { Link, useNavigate } from "react-router-dom";

function PatientList() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getPatients();
    }, []);

    const getPatients = async () => {
        try {
            const response = await api.get("api/patients/");
            setPatients(response.data);
        } catch (error: any) {
            if (error.response.status === 401) {
                navigate("/login");
            } else console.log("Could not get patients");
        }
    };

    return (
        <div className="relative overflow-x-auto max-w-7xl mx-auto mt-10 p-2">
            <Breadcrumb className="">
                <BreadcrumbList>
                    <BreadcrumbItem>
                            <Link to="/">Patient List</Link>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h2 className="font-semibold text-2xl">Patient List</h2>
            <PatientTable columns={columns} data={patients} />
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mt-2 ">Register New Patient</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <PatientForm getPatients={getPatients} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default PatientList;
