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
                The red areas are important for the model in the decision making process, while the blue are less relevant.
            </p>
            <div className="flex mx-auto">
                    <img 
                        src={
                            report?.grad_cam
                        }
                        className=" w-94 h-94"
                    />
                    <div className="mx-2 flex">
                        <div className="border-1 border-black opacity-70">
                            <div className="h-47 w-8 bg-linear-to-t from-yellow-300 to-red-500"></div>
                            <div className="h-47 w-8 bg-linear-to-t from-blue-500 to-yellow-300"></div>
                        </div>
                        <div className="flex-col space-y-82 ml-4 text-gray-600">
                            <p className="align-text-top">
                                Higher
                            </p>
                            <p className="align-text-bottom">
                                Lower
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            </div> : <p>Upload data to get an explanation</p>}
        </div>
    );
}

export default ExplanationDashboard;
