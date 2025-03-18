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

function PatientProfile() {
    const { id } = useParams();
    const [patient, setPatient] = useState<Patient | null>(null);

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
            <h2 className="font-semibold text-2xl ">
                {" "}
                {patient?.first_name} {patient?.last_name}
            </h2>
            <Separator className="mt-2"/>
                <Tabs defaultValue="diagnosis" className=" max-w-full mt-2 ">
                    <TabsList className="shadow-sm">
                        <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                        <TabsTrigger value="explanation">
                            Explanation
                        </TabsTrigger>
                        <TabsTrigger value="uploadData">
                            Upload Data
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="diagnosis" className=" max-w-full justify-center">
                        <DiagnosisDashboard patient_id={id}/>
                    </TabsContent>
                    <TabsContent value="explanation" className="max-w-full justify-center">
                        <ExplanationDashboard patient_id={id}/>
                    </TabsContent>
                    <TabsContent value="uploadData">
                            <DiagnosisForm patient_id={id} />
                    </TabsContent>
                </Tabs>
        </div>
    );
}

export default PatientProfile;
