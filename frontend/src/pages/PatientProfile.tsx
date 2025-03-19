import { Patient } from "@/types/types";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiagnosisForm from "@/components/DiagnosisForm";
import DiagnosisDashboard from "@/components/DiagnosisDashboard";
import ExplanationDashboard from "@/components/ExplanationDashboard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

function PatientProfile() {
    const { id } = useParams();
    const [patient, setPatient] = useState<Patient | null>(null);
    const navigate = useNavigate();
    const [deleted, setDeleted] = useState<boolean>(false);

    useEffect(() => {
        getPatient();
    }, []);

    const getPatient = () => {
        api.get("api/patients/" + id + "/")
            .then((res) => res.data)
            .then((data) => {
                setPatient(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const redirectHome = () => {
        navigate("../")
    }

    const deletePatient = async () => {
        try {
            const response = await api.delete(`api/patients/delete/${id}/`);
            if (response.status === 200 || response.status === 204) {
                setDeleted(true);
                setTimeout(redirectHome, 3000);
                return true;
            } else {
                console.error("Failed to delete patient:", response);
                alert("Failed to delete the patient.");
                return false;
            }
        } catch (error) {
            alert("Something went wrong. Please try again.");
            return false;
        }
    };

    return (
        <div className="relative overflow-x-auto max-w-7xl mx-auto mt-10 p-2 ">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Patient List</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/patients/${id}`}>
                            {patient?.last_name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex w-full justify-between">
                <h2 className="font-semibold text-2xl ">
                    {" "}
                    {patient?.first_name} {patient?.last_name}
                </h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="hover:bg-red-400">
                            Delete Patient
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        {deleted ? (
                            <p>
                                Patient successfully deleted. Redirecting to
                                home page in 3 seconds...
                            </p>
                        ) : (
                            <div>
                                <h3 className="font-semibold text-2xl">
                                    Warning!
                                </h3>
                                <p>
                                    You are about to delete patient{" "}
                                    {patient?.last_name} from the records. This
                                    action is permanent. Do you want to delete
                                    the patient?
                                </p>
                                <Button
                                    className=" hover:bg-red-600 mt-4 w-full"
                                    onClick={() => deletePatient()}
                                >
                                    Delete Patient
                                </Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
            <Separator className="mt-2" />
            <Tabs defaultValue="diagnosis" className=" max-w-full mt-2 ">
                <TabsList className="shadow-sm">
                    <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                    <TabsTrigger value="explanation">Explanation</TabsTrigger>
                    <TabsTrigger value="uploadData">Upload Data</TabsTrigger>
                </TabsList>
                <TabsContent
                    value="diagnosis"
                    className=" max-w-full justify-center"
                >
                    <DiagnosisDashboard patient_id={id} />
                </TabsContent>
                <TabsContent
                    value="explanation"
                    className="max-w-full justify-center"
                >
                    <ExplanationDashboard patient_id={id} />
                </TabsContent>
                <TabsContent value="uploadData">
                    <DiagnosisForm patient_id={id} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default PatientProfile;
