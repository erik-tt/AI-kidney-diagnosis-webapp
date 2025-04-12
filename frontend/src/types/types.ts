export interface Patient {
    id: string,
    first_name: string,
    last_name: string,
    gender: string,
    date_of_birth: string
}

export interface DiagnosisReport {
    id: string,
    ckd_prediction: number,
    updated: string,
    created_at: string
    png_image_overlay: string
    renogram_dict: { [key: string]: number[] }
    grad_cam : string
    
    avgimage1: string
    avgimage2: string
    avgimage3: string
    avgimage4: string
}