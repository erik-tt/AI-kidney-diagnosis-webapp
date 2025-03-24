import numpy as np

# For testing

def generate_renogram(pixel_array, mask):

    label_data = mask.get_fdata()
    label_data = np.squeeze(label_data)

    roi_labels = np.unique(label_data)
    roi_labels = roi_labels[roi_labels != 0]

    roi_averages = {label: [] for label in roi_labels}

    for t in range(pixel_array.shape[0]):
        img = pixel_array[t, :, :]
        
        for label in roi_labels:
            roi_mask = (label_data == label)
            roi_pixels = img[roi_mask]

            if roi_pixels.size > 0:
                avg_intensity = np.mean(roi_pixels)
            else:
                avg_intensity = 0
            
            roi_averages[label].append(float(avg_intensity))

    # Kan plotte, men burde slettes og kun returne roi_averages
    #Label is left or right (right now it is not seperated, so labels is just 1)
    return roi_averages
