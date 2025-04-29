import { DiagnosisReport } from "@/types/types";
import Renogram from "./Renogram";
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DiagnosisDashboardProps {
    report: DiagnosisReport | null;
}

function DiagnosisDashboard({ report }: DiagnosisDashboardProps) {
    const getCKDDescription = () => {
        if (report?.ckd_prediction == 5) {
            return (
                <p className="text-gray-600 text-xs">
                    GFR levels close to failure
                </p>
            );
        }
        if (report?.ckd_prediction == 4) {
            return (
                <p className="text-gray-600 text-xs">
                    GFR is severly decreased
                </p>
            );
        }
        if (report?.ckd_prediction == 3) {
            return (
                <p className="text-gray-600 text-xs">
                    GFR is moderately decreased
                </p>
            );
        }
        if (report?.ckd_prediction == 2) {
            return (
                <p className="text-gray-600 text-xs">
                    GFR is slightly decreased
                </p>
            );
        }
        if (report?.ckd_prediction == 1) {
            return <p className="text-gray-600 text-xs">GFR is normal</p>;
        }
    };

    const getSRF = (left: boolean) => {
        var left_ROI: number = 0;
        var right_ROI: number = 0;

        if (report?.renogram_dict) {
            if (report.renogram_dict["3.0"] && report.renogram_dict["4.0"]) {
                var left_ROI = report?.renogram_dict["3.0"]
                    .slice(6, 12)
                    .reduce((a, b) => a + b, 0);
                var right_ROI: number = report?.renogram_dict["4.0"]
                    .slice(6, 12)
                    .reduce((a, b) => a + b, 0);
            }
            if (report.renogram_dict["3.0"] && !report.renogram_dict["4.0"]) {
                return 100;
            }
            if (!report.renogram_dict["3.0"] && report.renogram_dict["4.0"]) {
                return 0;
            }
            if (left) {
                return Math.round((left_ROI / (right_ROI + left_ROI)) * 100);
            } else {
                return Math.round((right_ROI / (right_ROI + left_ROI)) * 100);
            }
        }
    };

    const getMinuteForAverageImg = (image: number) => {
        let numberOfFrames = report?.renogram_dict["1.0"].length;

        if (numberOfFrames) {
            let minutes = numberOfFrames / 4 / 6;
            if (image === 1) {
                return (
                    <p className="text-gray-600 text-xs">0 - {minutes} min</p>
                );
            }
            if (image === 2) {
                return (
                    <p className="text-gray-600 text-xs">
                        {minutes} - {minutes * 2} min
                    </p>
                );
            }
            if (image === 3) {
                return (
                    <p className="text-gray-600 text-xs">
                        {minutes * 2} - {minutes * 3} min
                    </p>
                );
            }
            if (image === 4) {
                return (
                    <p className="text-gray-600 text-xs">
                        {minutes * 3} - {minutes * 4} min
                    </p>
                );
            }
        } else {
            return <p className="text-gray-600 text-xs">Unknown min</p>;
        }
    };

    const getTMax = (left: boolean) => {
        var key = left ? "1.0" : "2.0";
        if (report) {
            return (
                Math.round(
                    (report.renogram_dict[key].indexOf(
                        Math.max(...report.renogram_dict[key])
                    ) /
                        6) *
                        10
                ) / 10
            );
        }
    };

    const getTHalf = (left: boolean) => {
        var key = left ? "1.0" : "2.0";

        if (report) {
            var maxIndex = report.renogram_dict[key].indexOf(
                Math.max(...report.renogram_dict[key])
            );
            for (let i = maxIndex; i < report.renogram_dict[key].length; i++) {
                if (report.renogram_dict[key][i] <= report.renogram_dict[key][maxIndex]/2) {
                    return   Math.round(report.renogram_dict[key].indexOf(report.renogram_dict[key][i])/6 * 10) / 10
                }
            }
        }
        return NaN
    };
    return (
        <div>
            <h2 className="font-semibold text-2xl mt-2 ">
                Kidney diagnosis report
            </h2>

            {report ? (
                <div className="w-full">
                    <p className="text-gray-600 text-xs mb-4">
                        Last updated {report?.updated.split("T")[0]}{" "}
                        {report?.updated.split("T")[1].split(".")[0]} GMT{" "}
                    </p>
                    <div className="flex flex-row mb-2">
                        <div className="flex flex-col p-8 px-12 rounded-2xl shadow-sm outline-1 w-full text-center mr-2">
                            <p className="text-gray-800 text-lg">
                                Predicted CKD stage
                            </p>
                            <p className="font-semibold text-4xl mb-4">
                                {report?.ckd_prediction}
                            </p>
                            {getCKDDescription()}
                        </div>
                        <div className="flex flex-col p-8 px-12 rounded-2xl shadow-sm outline-1 w-full text-center mr-2">
                            <p className="text-gray-800 text-lg">
                                Relative left renal function
                            </p>
                            <p className="font-semibold text-4xl mb-4">
                                {getSRF(true) + "%"}
                            </p>
                            <p className="text-gray-600 text-xs">
                                Integral method over minute 1 to 2, adjusted for
                                background using perirenal area
                            </p>
                        </div>
                    </div>
                    <div className="flex lg:flex-row flex-col">
                        <div className="flex-1 p-2 m-1 rounded-2xl shadow-sm text-center bg-white outline-1 basis-1/2">
                            {report?.renogram_dict ? (
                                <div className="flex-col">
                                    <Renogram data={report.renogram_dict} />
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead />
                                                <TableHead className="text-center">
                                                    T-max
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    T-1/2
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-medium">
                                                    Left Kidney
                                                </TableCell>
                                                <TableCell>
                                                    {getTMax(true)} min
                                                </TableCell>
                                                <TableCell>{getTHalf(true)} min</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">
                                                    Right Kidney
                                                </TableCell>
                                                <TableCell>
                                                    {getTMax(false)} min
                                                </TableCell>
                                                <TableCell>{getTHalf(false)} min</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <p>could not load renogram</p>
                            )}
                        </div>
                        <div className="flex-2 p-4 m-1 rounded-2xl shadow-sm text-center bg-white outline-1 basis-1/2">
                            <h3 className="mt-2 text-gray-800 text-lg">
                                Segmented ROIs 1-3 min post injection
                            </h3>
                            <p className="text-gray-600 text-xs">
                                {" "}
                                With ML model that achieves {">"} 0.9 dice
                                similarity score on 10 fold cross validation
                            </p>
                            {report?.png_image_overlay ? (
                                <div className="flex md:flex-col md:content-center lg:flex-row justify-center mt-6 ml-2">
                                    <img
                                        src={report?.png_image_overlay}
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
                            <Separator className="mt-7" />
                            <h4 className="mt-2 text-gray-800 text-md">
                                Average Across Four Segments Post Injection
                            </h4>
                            <div className="flex justify-center">
                                <div>
                                    <img
                                        src={report?.avgimage1}
                                        className="align-middle w-32 h-32"
                                    />
                                    <p>{getMinuteForAverageImg(1)}</p>
                                </div>
                                <div>
                                    <img
                                        src={report?.avgimage2}
                                        className="align-middle w-32 h-32"
                                    />
                                    <p>{getMinuteForAverageImg(2)}</p>
                                </div>

                                <div>
                                    <img
                                        src={report?.avgimage3}
                                        className="align-middle w-32 h-32"
                                    />
                                    <p>{getMinuteForAverageImg(3)}</p>
                                </div>
                                <div>
                                    <img
                                        src={report?.avgimage4}
                                        className="align-middle w-32 h-32"
                                    />
                                    <p>{getMinuteForAverageImg(4)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <Link
                            to="/information"
                            className="underline text-gray-600 hover:text-gray-800 "
                        >
                            Learn how these values are calculated
                        </Link>
                    </div>
                </div>
            ) : (
                <p>Upload data to get a report</p>
            )}
        </div>
    );
}

export default DiagnosisDashboard;
