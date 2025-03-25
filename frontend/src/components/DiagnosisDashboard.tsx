import { DiagnosisReport } from "@/types/types";
import Renogram from "./Renogram";

interface DiagnosisDashboardProps {
    report : DiagnosisReport | null
}

function DiagnosisDashboard({ report }: DiagnosisDashboardProps) {

    const getCKDDescription = () => {
        if (report?.ckd_prediction == 5) {
            return <p className="text-gray-600 text-xs">GFR levels close to failure</p>
        }
        if (report?.ckd_prediction == 4) {
            return <p className="text-gray-600 text-xs">GFR is severly decreased</p>
        }
        if (report?.ckd_prediction == 3) {
            return <p className="text-gray-600 text-xs">GFR is severly decreased</p>
        }
        if (report?.ckd_prediction == 2) {
            return <p className="text-gray-600 text-xs">GFR is slightly decreased</p>
        }
        if (report?.ckd_prediction == 1) {
            return <p className="text-gray-600 text-xs">GFR is normal</p>
        }
    }

    return (
        <div>
            <h2 className="font-semibold text-2xl mt-2 mb-2">
                Kidney diagnosis report
            </h2>

            {report ? (
                <div className="w-full">
                    <div className="flex flex-row mb-2">
                        <div className="flex flex-col p-8 px-12 rounded-2xl shadow-sm outline-1">
                            <p className="text-gray-800 text-lg">Predicted CKD stage</p>
                            <p className="font-semibold text-4xl mb-4">
                                {report?.ckd_prediction}
                            </p>    
                            {getCKDDescription()}
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div className="flex-1 p-2 m-1 rounded-2xl shadow-sm text-center bg-white outline-1">
                            <h3 className="mt-2 text-gray-800 text-lg">
                                Renogram (Time Activity Curve)
                            </h3>
                            {report?.renogram_dict ? (
                                <Renogram data={report.renogram_dict} />
                            ) : (
                                <p>could not load renogram</p>
                            )}
                        </div>
                        <div className="flex-1 p-2 m-1 rounded-2xl shadow-sm text-center bg-white outline-1">
                            <h3 className="mt-2 text-gray-800 text-lg">
                                Segmented ROIs 1-3 min post injection
                            </h3>
                            {report?.png_image_overlay ? (
                                <div className="flex justify-center mt-6 ml-2">
                                    <img
                                        src={
                                            report?.png_image_overlay
                                        }
                                        className="mx-auto align-middle w-94 h-94"
                                    />
                                    <div className="p-2 mt-80 text-left">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                                            <p className="text-gray-700">
                                                Right Kidney
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                            <p className="text-gray-700">
                                                Left Kidney
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>Could not load mask overlay</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Upload data to get a report</p>
            )}
        </div>
    );
}

export default DiagnosisDashboard;
