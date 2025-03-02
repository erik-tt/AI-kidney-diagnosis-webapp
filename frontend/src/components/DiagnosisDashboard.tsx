import api from "@/utils/api";
import { useEffect, useState } from "react";
import { DiagnosisReport } from "@/types/types";

interface DiagnosisDashboardProps {
    patient_id : string | undefined    
}

function DiagnosisForm( {patient_id} : DiagnosisDashboardProps) {

    const [report, setReport] = useState<DiagnosisReport | undefined>()

    useEffect(() => {
        getReport();
    }, []);

    const getReport = () => {
        if (patient_id) {
            api.get("api/diagnosis_report/" + patient_id + "/")
                .then((res) => res.data)
                .then((data) => {
                    setReport(data);
                    console.log(data);
                })
                .catch((err) => alert(err));
        }};

   return (
     <div>
        <div className="flex flex-col">
            <div className="flex flex-col p-8  bg-gray-100 rounded-4xl">
                <p className="font-semibold text-2xl">{report?.ckd_prediction}</p>
                <p>CKD Stage</p>
            </div>
            <img src={report?.png_image_overlay + "?" + Date.now()}/>
        </div>
     </div>
   )
}

export default DiagnosisForm