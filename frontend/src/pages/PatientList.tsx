import { SetStateAction, useEffect, useState } from "react";
import api from "../utils/api";
import { Patient } from "../types/types";
import PatientForm from "../components/PatientForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";

function PatientList() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const navigate = useNavigate();

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
        <div className="relative overflow-x-auto max-w-7xl mx-auto mt-10 p-2">
            <Breadcrumb className="">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Patients List</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h2 className="font-semibold text-2xl">Patient List</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Last name</TableHead>
                        <TableHead>First name</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Date of birth</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                {patients.map((patient: Patient) => (
                    <TableBody>
                        <TableRow>
                            <TableCell>{patient.last_name}</TableCell>
                            <TableCell>{patient.first_name}</TableCell>
                            <TableCell>{patient.gender}</TableCell>
                            <TableCell>{patient.date_of_birth}</TableCell>
                            <TableCell>
                                <Button
                                    onClick={() =>
                                        navigate(`/patients/${patient.id}`)
                                    }
                                >
                                    Patient Profile
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                ))}
            </Table>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="mt-2 ">
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
