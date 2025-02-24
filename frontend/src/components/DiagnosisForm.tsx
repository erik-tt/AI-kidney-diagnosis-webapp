import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Button } from "./ui/button"
import api from "@/utils/api"

interface DiagnosisFormProps{
    patient_id : string | undefined
}

function DiagnosisForm( {patient_id} : DiagnosisFormProps) {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    //API handling to send info to backend and register a diagnosis report
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if(files)
        setFile(files[0])
      }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();

        const formData = new FormData();
        if (file) {
            formData.append("dicom_file", file);
        }
        if (patient_id) {
            formData.append("patient_id", patient_id);
        }

        try {
            const res = await api.post("api/diagnosis_report/create/", formData, { headers: { "Content-Type": "multipart/form-data" } });
            if (res.status === 201) {
                alert("Submitted data for automatic analyzis");
            } else alert("failed to send data");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <form className="mt-4"  onSubmit={handleSubmit}>
            <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="DICOM">DICOM scintigraphy file</Label>
            <Input id="DICOM" type="file" accept='.dcm' required onChange={handleFileInput}/>
            </div>
            <Button className="mt-2" type="submit">Analyze scintigraphy file</Button>
        </form>
    )
}

export default DiagnosisForm