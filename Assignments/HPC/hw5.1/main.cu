#include "kernel.cu"
#include <stdio.h>

// Establish a few constants
#define WIDTH 1024
#define HEIGHT 1024
#define CHANNELS 3 // RGB

int main() {
    const int img_size_rgb = WIDTH * HEIGHT * CHANNELS;
    const int img_size_grey = WIDTH * HEIGHT;

    unsigned char* h_rgb = new unsigned char[img_size_rgb];
    unsigned char* h_grey = new unsigned char[img_size_grey];

    // Read in the file
    std::ifstream input_file("gc_conv_1024x1024.raw", std::ios::binary);
    if (!input_file) {
        std::cerr << "Error opening input file.\n";
        return 1;
    }
    input_file.read(reinterpret_cast<char*>(h_rgb), img_size_rgb);
    input_file.close();

    // Allocate device variables
    unsigned char* d_rgb;
    unsigned char* d_grey;
    cudaMalloc(&d_rgb, img_size_rgb);
    cudaMalloc(&d_grey, img_size_grey);

    // Copy host variables to device
    cudaMemcpy(d_rgb, h_rgb, img_size_rgb, cudaMemcpyHostToDevice);

    cudaDeviceSynchronize();

    // Start the kernal
    int threads_per_block = 256;
    int num_blocks = (WIDTH * HEIGHT + threads_per_block - 1) / threads_per_block;
    rgb_to_greyscale<<<num_blocks, threads_per_block>>>(d_rgb, d_grey, WIDTH, HEIGHT);

    // Check if the kernal worked
    cuda_ret = cudaDeviceSynchronize();
	if(cuda_ret != cudaSuccess) printf("Unable to launch kernel");
    stopTime(&timer); printf("%f s\n", elapsedTime(timer));

    // copy result back
    cudaMemcpy(h_grey, d_grey, img_size_grey, cudaMemcpyDeviceToHost);

    // Write output file
    std::ofstream output_file("gc.raw", std::ios::binary);
    if (!output_file) {
        std::cerr << "Error opening output file.\n";
        return 1;
    }
    output_file.write(reinterpret_cast<char*>(h_grey), img_size_grey);
    output_file.close();

    // Free the memory
    delete[] h_rgb;
    delete[] h_grey;
    cudaFree(d_rgb);
    cudaFree(d_grey);

    // Send it on home
    return 0
}
