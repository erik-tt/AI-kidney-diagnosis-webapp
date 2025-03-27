import { DiagnosisReport, Patient } from "@/types/types";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

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
import { useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

function PatientProfile() {
    const { id } = useParams();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [report, setReport] = useState<DiagnosisReport | null>(null);
    const navigate = useNavigate();
    const [deleted, setDeleted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getPatient();
        getReport();
    }, []);

    const getPatient = async () => {
        try {
            const response = await api.get("api/patients/" + id + "/");
            setPatient(response.data);
        } catch (error: any) {
            if (error.response.status === 401) {
                navigate("/login");
            } else console.log("Could not get patient with id " + id);
        }
    };
    const getReport = async () => {
        setLoading(true);
        try {
            const response = await api.get("api/diagnosis_report/" + id + "/");
            setReport(response.data);
        } catch (error: any) {
            if (error.response.status === 401) {
                navigate("/login");
            } else
                console.log("Could not get report for patient with id " + id);
        } finally {
            setLoading(false);
        }
    };

    const redirectHome = () => {
        navigate("../");
    };

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
                        <BreadcrumbLink asChild>
                            <Link to="/">Patient List</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>
                            <Link to={`/patients/${id}`}>
                                {patient?.last_name}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex w-full justify-between">
                    <h2 className="font-semibold text-2xl ">
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
                    {loading ? (
                        <div>
                            <Skeleton className="w-64 h-[20px] rounded-full m-2 mt-4" />
                            <Skeleton className="w-full h-64 rounded-md m-2 mt-4" />
                            <div className="flex">
                                <Skeleton className="w-full h-96 rounded-md m-2" />
                                <Skeleton className="w-full h-96 rounded-md m-2" />
                            </div>
                        </div>
                    ) : (
                        <DiagnosisDashboard report={report} />
                    )}
                </TabsContent>
                <TabsContent
                    value="explanation"
                    className="max-w-full justify-center"
                >
                    {loading ? (
                        <div>
                            <Skeleton className="w-64 h-6 rounded-full m-2 mt-4" />
                            <Skeleton className="w-full h-4 rounded-full m-2 mt-4" />
                            <Skeleton className="w-full h-4 rounded-full m-2 mt-4" />
                            <Skeleton className="w-full h-4 rounded-full m-2 mt-4" />
                            <div className="flex flex-col justify-center items-center">
                                <Skeleton className="w-84 h-6 rounded-full m-2 mt-4" />
                                <Skeleton className="w-96 h-96 rounded-md m-2" />
                            </div>
                        </div>
                    ) : (
                    <ExplanationDashboard report={report} />
                )}
                </TabsContent>
                <TabsContent value="uploadData">
                    <DiagnosisForm patient_id={id} getReport={getReport} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default PatientProfile;
