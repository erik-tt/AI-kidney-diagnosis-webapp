import api from "@/utils/api";
import { useEffect, useState } from "react";
import { DiagnosisReport } from "@/types/types";

interface ExplanationDashboardProps {
    patient_id: string | undefined;
}

function ExplanationDashboard({ patient_id }: ExplanationDashboardProps) {
    //TODO: Make the reports be retrived from the page and sent in as props
    const [report, setReport] = useState<DiagnosisReport | undefined>();

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
                });
        }
    };

    return (
        <div>
           <h2 className="font-semibold text-2xl mt-2 mb-2">
                XAI Explanation of CKD Stage Prediction
            </h2>
            <p className="text-gray-600">
                This page provides an explanation for the CKD stage prediction XAI stands for explanable AI. This page shows the output of Grad CAM ++, a XAI model that outputs a heatmap of what the deep learning model making the prediction focuses on.
            </p>
            <div className="flex flex-col justify-center mt-6 ml-2">
            <h3 className="font-semibold text-2xl mt-2 text-center" >
                XAI Explanation of CKD Stage Prediction
            </h3>
            <p className="text-gray-600 text-center mb-2">
                The red areas are important for the model in the decision making process.
            </p>
                                    <img
                                        src={
                                            report?.grad_cam +
                                            "?" +
                                            Date.now()
                                        }
                                        className="mx-auto align-middle w-94 h-94"
                                    />
            </div>
        </div>
    );
}

export default ExplanationDashboard;
