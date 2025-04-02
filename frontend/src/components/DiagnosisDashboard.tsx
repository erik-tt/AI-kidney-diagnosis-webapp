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
            return <p className="text-gray-600 text-xs">GFR is moderately decreased</p>
        }
        if (report?.ckd_prediction == 2) {
            return <p className="text-gray-600 text-xs">GFR is slightly decreased</p>
        }
        if (report?.ckd_prediction == 1) {
            return <p className="text-gray-600 text-xs">GFR is normal</p>
        }
    }

    const getSRF = (left : boolean) => {
        var left_ROI: number = 0
        var right_ROI: number = 0

        if (report?.renogram_dict) {
            if (report.renogram_dict["3.0"] && report.renogram_dict["4.0"]){
                var left_ROI = report?.renogram_dict["3.0"].slice(6, 12).reduce((a, b) => a + b, 0)
                var right_ROI : number = report?.renogram_dict["4.0"].slice(6, 12).reduce((a, b) => a + b, 0)
            }
            if (report.renogram_dict["3.0"] && !report.renogram_dict["4.0"]){
                return 100
            }
            if (!report.renogram_dict["3.0"] && report.renogram_dict["4.0"]){
                return 0
            }
        if (left){
            return Math.round(left_ROI/(right_ROI + left_ROI) * 100)
        } else {
            return  Math.round(right_ROI/(right_ROI + left_ROI) * 100)
        }

        }
    }

    return (
        <div>
            <h2 className="font-semibold text-2xl mt-2 ">
                Kidney diagnosis report
            </h2>

            {report ? (
                <div className="w-full">
                    <p className="text-gray-600 text-xs mb-4">Last updated {report?.updated.split("T")[0]} {report?.updated.split("T")[1].split(".")[0]} GMT </p>
                    <div className="flex flex-row mb-2">
                        <div className="flex flex-col p-8 px-12 rounded-2xl shadow-sm outline-1 w-full text-center mr-2">
                            <p className="text-gray-800 text-lg">Predicted CKD stage</p>
                            <p className="font-semibold text-4xl mb-4">
                                {report?.ckd_prediction}
                            </p>
                            {getCKDDescription()}
                        </div>
                        <div className="flex flex-col p-8 px-12 rounded-2xl shadow-sm outline-1 w-full text-center mr-2">
                            <p className="text-gray-800 text-lg">Relative left kidney function</p>
                                    <p className="font-semibold text-4xl mb-4">
                                        {getSRF(true) + "%"}
                                    </p>
                                <p className="text-gray-600 text-xs">Background adjusted</p>
                        </div>
                    </div>
                    <div className="flex lg:flex-row flex-col">
                        <div className="flex-1 p-2 m-1 rounded-2xl shadow-sm text-center bg-white outline-1 basis-1/2">
                            {report?.renogram_dict ? (
                                <Renogram data={report.renogram_dict} />
                            ) : (
                                <p>could not load renogram</p>
                            )}
                        </div>
                        <div className="flex-2 p-4 m-1 rounded-2xl shadow-sm text-center bg-white outline-1 basis-1/2">
                            <h3 className="mt-2 text-gray-800 text-lg">
                                Segmented ROIs 1-3 min post injection
                            </h3>
                            {report?.png_image_overlay ? (
                                <div className="flex md:flex-col md:content-center lg:flex-row justify-center mt-6 ml-2">
                                    <img
                                        src={
                                            report?.png_image_overlay
                                        }
                                        className="align-middle w-64 h-64 sm:w-94 sm:h-94 md:w-84 md:h-84"
                                    />
                                    <div className="p-2 lg:mt-68 text-left">
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
