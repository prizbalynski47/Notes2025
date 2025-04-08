#include <iostream>
#include <fstream>
#include <cuda.h>
#include <chrono>

// Define some constants. In some more general applications we might want to make the width and
// height parameters or grab them from the file, but for this assignment we're just using the one image.
#define WIDTH 1024
#define HEIGHT 1024
#define CHANNELS 3
#define TILE_DIM 32

using namespace std;

__global__ void transpose_global(unsigned char* in, unsigned char* out, int width, int height) {
    // Assigin each thread to a pixel location
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;

    // Compute transposed postion and store it in the out array
    if (x < width && y < height) {
        for (int c = 0; c < CHANNELS; ++c) {
            out[(x * height + y) * CHANNELS + c] = in[(y * width + x) * CHANNELS + c];
        }
    }
}

__global__ void transpose_shared(unsigned char* in, unsigned char* out, int width, int height) {
    // Make shared memory tile
    __shared__ unsigned char tile[TILE_DIM][TILE_DIM * CHANNELS];

    // Get the global x and y locations for the thread
    int x = blockIdx.x * TILE_DIM + threadIdx.x;
    int y = blockIdx.y * TILE_DIM + threadIdx.y;

    // Copy from global memory into the tile
    if (x < width && y < height) {
        for (int c = 0; c < CHANNELS; ++c)
            tile[threadIdx.y][threadIdx.x * CHANNELS + c] = in[(y * width + x) * CHANNELS + c];
    }

    // Wait for everything to load their tile
    __syncthreads();

    // Transpose indeces within the block
    x = blockIdx.y * TILE_DIM + threadIdx.x;
    y = blockIdx.x * TILE_DIM + threadIdx.y;

    // Copy back from shared to global at new transposed locations
    if (x < height && y < width) {
        for (int c = 0; c < CHANNELS; ++c)
            out[(y * height + x) * CHANNELS + c] = tile[threadIdx.x][threadIdx.y * CHANNELS + c];
    }
}

// Transposes the image serially for validation
void transpose_cpu(unsigned char* in, unsigned char* out, int width, int height) {
    for (int y = 0; y < height; ++y)
        for (int x = 0; x < width; ++x)
            for (int c = 0; c < CHANNELS; ++c)
                out[(x * height + y) * CHANNELS + c] = in[(y * width + x) * CHANNELS + c];
}

// Simple validation that goes pixel by pixel and checks they match
bool validate(unsigned char* a, unsigned char* b, int size) {
    for (int i = 0; i < size; ++i)
        if (a[i] != b[i])
            return false;
    return true;
}

// Standard code to write to file
void save_to_file(const string& filename, unsigned char* data, int size) {
    ofstream out(filename, ios::binary);
    out.write(reinterpret_cast<char*>(data), size);
    out.close();
}

int main() {
    // Calculate the character size of the image
    const int imageSize = WIDTH * HEIGHT * CHANNELS;

    // Make the containers for the image data
    unsigned char* h_input = new unsigned char[imageSize];
    unsigned char* h_output_global = new unsigned char[imageSize];
    unsigned char* h_output_shared = new unsigned char[imageSize];
    unsigned char* h_reference = new unsigned char[imageSize];

    // Read in the file
    ifstream in("gc_1024x1024.raw", ios::binary);
    if (!in) {
        cerr << "Failed to open input file." << endl;
        return 1;
    }
    in.read(reinterpret_cast<char*>(h_input), imageSize);
    in.close();

    // Allocate GPU memory
    unsigned char *d_input, *d_output;
    cudaMalloc(&d_input, imageSize);
    cudaMalloc(&d_output, imageSize);

    cudaMemcpy(d_input, h_input, imageSize, cudaMemcpyHostToDevice);

    // Set up thread blocks
    dim3 blockSize(TILE_DIM, TILE_DIM);
    dim3 gridSize((WIDTH + TILE_DIM - 1) / TILE_DIM, (HEIGHT + TILE_DIM - 1) / TILE_DIM);

    // Global memory transpose (with timing)
    auto start = chrono::high_resolution_clock::now();
    transpose_global<<<gridSize, blockSize>>>(d_input, d_output, WIDTH, HEIGHT);
    cudaDeviceSynchronize();
    auto end = chrono::high_resolution_clock::now();
    float time_global = chrono::duration<float, milli>(end - start).count();

    // Get the result back from the GPU
    cudaMemcpy(h_output_global, d_output, imageSize, cudaMemcpyDeviceToHost);

    // Shared memory transpose (also with timing)
    start = chrono::high_resolution_clock::now();
    transpose_shared<<<gridSize, blockSize>>>(d_input, d_output, WIDTH, HEIGHT);
    cudaDeviceSynchronize();
    end = chrono::high_resolution_clock::now();
    float time_shared = chrono::duration<float, milli>(end - start).count();

    // Get the result back from the GPU
    cudaMemcpy(h_output_shared, d_output, imageSize, cudaMemcpyDeviceToHost);

    // CPU transpose for validation
    transpose_cpu(h_input, h_reference, WIDTH, HEIGHT);

    // Validate against CPU transpose
    bool valid_global = validate(h_output_global, h_reference, imageSize);
    bool valid_shared = validate(h_output_shared, h_reference, imageSize);

    // Report validation results
    cout << "Global valid: " << (valid_global ? "Yes" : "No") << endl;
    cout << "Shared valid: " << (valid_shared ? "Yes" : "No") << endl;

    // Calculate bandwidths
    float bandwidth_global = (float)imageSize / (time_global / 1000) / 1e9;
    float bandwidth_shared = (float)imageSize / (time_shared / 1000) / 1e9;

    // Report bandwidths
    // My bandwidth results on notchpeak:
    // Global transpose time: 2.40865 ms, Bandwidth: 1.30601 GB/s
    // Shared transpose time: 0.610389 ms, Bandwidth: 5.15364 GB/s
    cout << "Global transpose time: " << time_global << " ms, Bandwidth: " << bandwidth_global << " GB/s" << endl;
    cout << "Shared transpose time: " << time_shared << " ms, Bandwidth: " << bandwidth_shared << " GB/s" << endl;

    // Save the matrices to file
    save_to_file("transposed_global.raw", h_output_global, imageSize);
    save_to_file("transposed_shared.raw", h_output_shared, imageSize);

    // End of file resource cleanup
    cudaFree(d_input);
    cudaFree(d_output);
    delete[] h_input;
    delete[] h_output_global;
    delete[] h_output_shared;
    delete[] h_reference;

    return 0;
}
