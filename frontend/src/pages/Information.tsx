

function Information() {

    return (
        <div className="lg:mx-64 md:mx-32 mx-4 text-center text-gray-800 p-8">
             <h1 className="font-semibold text-3xl m-8 text-center ">
                Diagnosis Report Information
            </h1>
            <p>
                This information page explains how the information in the diagnosis report is calculated and what methods and technologies are used. 
                It also provides information on how these models have been tested and how performance is evaluated.
            </p>

            <h2 className="font-semibold text-2xl m-8 ">
                CKD Prediction
            </h2>
            <p className="text-red-500"> Update to the latest model info and evaluation metrics</p>
            <p>
                The CKD prediction is obtained using a machine learning algorithm. The mean aggregated 1-3 min image is used as input into a pretrained ResNet18 model from  { }
                <a href="https://docs.monai.io/en/stable/networks.html#nets" className="underline text-gray-800 hover:text-black ">
                MONAI</a>. The model is trained for X epochs using data from the { } <a href="https://dynamicrenalstudy.org/" className="underline text-gray-800 hover:text-black ">Database of dynamic renal scintigraphy</a>.
                Splitting the data into a training and evaluation set, the model acheives around 50% accuracy for 5 CKD stage prediction.
            </p>

            <h2 className="font-semibold text-2xl m-8 ">
                ROI Segmentation
            </h2>
            <p>
                ROI (Region of Interests) are segmented using a machine learning algorithm. The swin-UNETR version 2 from MONAI is used to segment the kidneys. 
                The kidney borders are manually labeled and used to train and evaluate the model. Using 10-fold cross validation the model achieved an average dice similarity score
                of 0.918 with a standard deviation of 0.012. After the model outputs its prediction the system removes smaller patches if more than two are predicted. The model is not concerned with seperating
                left and right kidneys. The system seperates this by identifying the center of the predictions and labeling them left or rigth depending on how they are located relative to eachother. If there is only
                one kidney it is labeled relative to the center of the image.
            </p>

            <h2 className="font-semibold text-2xl m-8 ">
                Renogram (Time Activity Curve)
            </h2>
            <p>
                The renogram show the activity of the two kidney over time. The pixel values inside the ROIs from the segmentation masks are summed together over each frame 
                in the study. Background correction is not applied in this renogram, so activity of tissue and vascular background components impacts the curves.
            </p>

            <h2 className="font-semibold text-2xl m-8 ">
                Relative Kidney Function
            </h2>
            <p>
                Relative kidney function (the same as split renal function or differential renal function) is calculated using the integral method. We do the calculations by taking the counts of the left kidney and dividing by the total counts in both kidneys from minute 1 to 2. The counts are adjusted for background activity.
               The mean of a small perirenal area is multiplied by the size of the ROI and subtracted from the kidney counts. This method is used to limit the impact of tissue and vascular activity when calculating kidney activity.
            </p>

        </div>
    );
}


 export default Information;