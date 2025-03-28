import numpy as np

def generate_renogram(pixel_array, mask):

    label_data = mask.get_fdata()
    label_data = np.squeeze(label_data)

    roi_labels = np.unique(label_data)
    roi_labels = roi_labels[roi_labels != 0]

    roi_sum = {label: [] for label in roi_labels}

    for t in range(pixel_array.shape[0]):
        img = pixel_array[t, :, :]
        
        for label in roi_labels:
            roi_mask = (label_data == label)
            roi_pixels = img[roi_mask]

            if roi_pixels.size > 0:
                pixel_sum = np.sum(roi_pixels)
            else:
                pixel_sum = 0
            
            roi_sum[label].append(float(pixel_sum))

    return roi_sum
