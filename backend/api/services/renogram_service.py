import numpy as np

def get_kidney_ROI_counts(pixel_array, mask):

    label_data = mask.get_fdata()
    label_data = np.squeeze(label_data)

    roi_labels = np.unique(label_data)
    roi_labels = roi_labels[roi_labels != 0]

    roi_sum = {label: [] for label in roi_labels}

    #Get the kidney ROI counts
    for t in range(pixel_array.shape[0]):
        img = pixel_array[t, :, :]
        
        for label in roi_labels:
            #Stop after kidney labels and do not iterate over background labels
            if label > 2:
                break

            roi_mask = (label_data == label)
            roi_pixels = img[roi_mask]

            if roi_pixels.size > 0:
                #Handle kidney counts
                kidney_count = np.sum(roi_pixels)
                pixel_count = np.size(roi_pixels)
                #handle background
                background_mask = (label_data == label + 2)
                background_pixels = img[background_mask]
                if background_pixels.size > 0:
                    kidney_count_background_adjust =  kidney_count - (np.mean(background_pixels) * pixel_count)
                    #Add for background adjusted counts (with keys 3 and 4)
                    roi_sum[label + 2].append(float(kidney_count_background_adjust))
            else:
                kidney_count = 0
            
            roi_sum[label].append(float(kidney_count))
        
    return roi_sum
