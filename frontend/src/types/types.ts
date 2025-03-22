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
    renogram_dict: object
    grad_cam : string
}