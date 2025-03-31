__global__
void rgb_to_greyscale(unsigned char* input, unsigned char* output, int width, int height) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    int total_pixels = width * height;

    if (idx < total_pixels) {
        int rgb_idx = idx * CHANNELS;
        unsigned char r = input[rgb_idx];
        unsigned char g = input[rgb_idx + 1];
        unsigned char b = input[rgb_idx + 2];

        // Standard luminance formula
        // Found at https://www.w3.org/TR/AERT/#color-contrast
        output[idx] = static_cast<unsigned char>(0.299f * r + 0.587f * g + 0.114f * b);
    }
}