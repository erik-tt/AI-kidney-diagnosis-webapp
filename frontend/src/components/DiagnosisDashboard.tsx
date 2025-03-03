import api from "@/utils/api";
import { useEffect, useState } from "react";
import { DiagnosisReport } from "@/types/types";
import Renogram from "./Renogram";

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
        {/* <div className="flex flex-row">
            <div className="flex flex-col p-8 rounded-2xl shadow-sm">
                <p className="font-semibold text-2xl">{report?.ckd_prediction}</p>
                <p>CKD Stage</p>
            </div>
        </div> */}
        <h2 className="font-semibold text-2xl mt-2 mb-2">Kidney diagnosis report</h2>
        <div className="flex flex-row">
            <div className="flex-1 p-2 m-1 rounded-2xl shadow-sm text-center bg-white">
                <h3 className="mt-2 font-semibold text-md">Renogram (Time Activity Curve)</h3>
                {report?.renogram_dict ?
                <Renogram data={report.renogram_dict} /> : <p>could not load renogram</p>}
            </div>
            <div className="flex-1 p-2 m-1 rounded-2xl shadow-sm text-center bg-white">
                <h3 className="mt-2 font-semibold text-md">Segmented ROIs 0-3 min post injection</h3>
                <div className="flex justify-center mt-6 ml-2">
                    <img src={report?.png_image_overlay + "?" + Date.now()} className="mx-auto align-middle w-94 h-94"/>
                    <div className="p-2 mt-80 text-left">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                            <p className="text-gray-700">Right Kidney</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <p className="text-gray-700">Left Kidney</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     </div>
   )
}

export default DiagnosisForm