import { ColumnDef } from "@tanstack/react-table"
import { Patient } from "../types/types";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
 

export const columns: ColumnDef<Patient>[] = [
    {
        accessorKey: "last_name",
        header: "Last Name",
    },
    {
        accessorKey: "first_name",
        header: "First Name",
    },
    {
        accessorKey: "gender",
        header: "Gender",
    },
    {
        accessorKey: "date_of_birth",
        header: "Date of birth",
    },

    {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const patient = row.original


      const navigate = useNavigate();
      return (
        <div>
            <Button
                onClick={() =>
                    navigate(`/patients/${patient.id}`)
                }
            >
                Patient Profile
            </Button>
        </div>
        
      );
    }
}

];