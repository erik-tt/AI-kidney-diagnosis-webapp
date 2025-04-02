import Plot from "react-plotly.js";

interface RenogramProps {
    data: object
}

function Renogram( {data} : RenogramProps) {

    const renogram_data: any = Object.entries(data).filter(([key]) => key === "1.0" || key === "2.0")
    .map(([key, values]) => ({
        x: values.map((_ : string, index : number) => index),
        y: values,
        type: 'scatter',
        mode: 'lines',
        name: key == "1.0" ? "Left Kidney" : "Right Kidney",
        line: key === "1.0" ? { color: "blue", width: 2 } : { color: "red", width: 2}
    }));

    return ( 
    <div>
        <Plot
            data={renogram_data}
            layout={{
                showlegend: true,
                title: {
                    text: "Renogram (Time Activity Curve)",
                    font: { size: 18 }
                },
                xaxis: {
                    title: {
                        text: "Frames",
                        font: { size: 14 }
                    }
                },
                yaxis: {
                    title: {
                        text: "ROI counts",
                        font: { size: 14 }
                    }
                }
            }}
            style={{width: "100%", height: "100%"}}
            useResizeHandler={true}
        />
    </div>
)}

export default Renogram