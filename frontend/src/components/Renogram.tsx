import Plot from "react-plotly.js";

interface RenogramProps {
    data: object
}

function Renogram( {data} : RenogramProps) {

    const renogram_data: any = Object.entries(data).map(([key, values]) => ({
        x: values.map((_ : string, index : number) => index),
        y: values,
        type: 'scatter',
        mode: 'lines',
        name: key == "1.0" ? "Left Kidney" : "Right Kidney" 
    }));

    return ( 
    <div>
        <Plot
            data={renogram_data}
            layout={{showlegend: true }}
        />
    </div>
)}

export default Renogram