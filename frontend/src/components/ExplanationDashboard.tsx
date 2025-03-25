import { DiagnosisReport } from "@/types/types";

interface ExplanationDashboardProps {
    report : DiagnosisReport | null;
}

function ExplanationDashboard({ report }: ExplanationDashboardProps) {

    return (
        <div>
           <h2 className="font-semibold text-2xl mt-2 mb-2">
                XAI Explanation of CKD Stage Prediction
            </h2>
            {report ? <div>
            <p className="text-gray-600">
                This page provides an explanation for the CKD stage prediction XAI stands for explanable AI. This page shows the output of Grad CAM ++, a XAI model that outputs a heatmap of what the deep learning model making the prediction focuses on.
            </p>
            <div className="flex flex-col justify-center mt-6 ml-2">
            <h3 className="font-semibold text-2xl mt-2 text-center" >
                Grad CAM ++ Heatmap
            </h3>
            <p className="text-gray-600 text-center mb-2">
                The red areas are important for the model in the decision making process.
            </p>
                                    <img
                                        src={
                                            report?.grad_cam
                                        }
                                        className="mx-auto align-middle w-94 h-94"
                                    />
            </div>
            </div> : <p>Upload data to get an explanation</p>}
        </div>
    );
}

export default ExplanationDashboard;
