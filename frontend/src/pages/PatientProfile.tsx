import { useParams } from "react-router-dom";

function PatientProfile() {
    const { id } = useParams();
    return <h1>Patient profiles {id} </h1>
}

export default PatientProfile