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
        name: key == "1.0" ? "Left Kidney" : "Right Kidney",
        line: { color: key=="1.0" ? "blue" : "red", width: 2 },
    }));

    return ( 
    <div>
        <Plot
            data={renogram_data}
            layout={{showlegend: true}}
            style={{width: "100%", height: "100%"}}
            useResizeHandler={true}
        />
    </div>
)}

export default Renogram