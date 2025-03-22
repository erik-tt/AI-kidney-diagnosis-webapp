import { useEffect, useState } from "react";
import api from "../utils/api";
import { Patient } from "../types/types";
import PatientForm from "../components/PatientForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "../components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { PatientTable } from "@/components/PatientsTable";
import { columns } from "@/components/Columns";

function PatientList() {
    const [patients, setPatients] = useState<Patient[]>([]);

    useEffect(() => {
        getPatients();
    }, []);

    const getPatients = () => {
        api.get("api/patients/")
        .then((res) => res.data)
        .then((data) => {
            setPatients(data);
        })
        .catch(() => alert("an error occured"));
    };


    return (
        <div className="relative overflow-x-auto max-w-7xl mx-auto mt-10 p-2">
            <Breadcrumb className="">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Patient List</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h2 className="font-semibold text-2xl">Patient List</h2>
            <PatientTable columns={columns} data={patients}/>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mt-2 ">
                        Register New Patient
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <PatientForm getPatients={getPatients} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default PatientList;
