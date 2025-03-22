import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "./ui/button";
import api from "@/utils/api";

interface DiagnosisFormProps {
    patient_id: string | undefined;
}

function DiagnosisForm({ patient_id }: DiagnosisFormProps) {
    const [file, setFile] = useState<File | null>(null);
    //const [loading, setLoading] = useState(false);

    //API handling to send info to backend and register a diagnosis report
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files) setFile(files[0]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        //setLoading(true);
        e.preventDefault();

        const formData = new FormData();
        if (file) {
            formData.append("dicom_file", file);
        }
        if (patient_id) {
            formData.append("patient", patient_id);
        }

        try {
            const res = await api.post(
                "api/diagnosis_report/create/",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            if (res.status === 201) {
                alert("Added data");
            }
            if (res.status === 200) {
                alert("Updated data");
            } else alert("failed to send data");
        } catch (error) {
            alert("an error occured");
        } finally {
            //setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="font-semibold text-2xl mt-2 mb-2">
                Upload data to analyze
            </h2>
            <p className="text-gray-600">
                Upload a 99mTc-MAG3 scintigraphy POST study to this patient. The
                data will be analyzed and the results will be visible under
                diagnosis. Note that a single patient can as of now only contain
                one report. Uploading a study will replace the previous one.
            </p>
            <form className="mt-4" onSubmit={handleSubmit}>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="DICOM" className="font-semibold">
                        DICOM scintigraphy file
                    </Label>
                    <Input
                        id="DICOM"
                        type="file"
                        accept=".dcm"
                        required
                        onChange={handleFileInput}
                        className="shadow bg-white"
                    />
                </div>
                <Button className="mt-2 shadow" type="submit">
                    Analyze scintigraphy file
                </Button>
            </form>
            <div className="mt-2 text-sm tracking-tight text-gray-500">
                <p className="font-bold text-red-600 ">Disclaimer: </p>
                <p>
                    This site is a research project. Do not upload personal
                    health information data to this site! We have developed and
                    tested this using open data from the Database of dynamic
                    renal scintigraphy - www.dynamicrenalstudy.org
                </p>
            </div>
        </div>
    );
}

export default DiagnosisForm;
