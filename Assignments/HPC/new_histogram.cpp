#include <iostream>
#include <cstdlib>
#include <vector>
#include <ctime>
#include <mpi.h>

// Set the random seed
int RANDOM_SEED = 100;

// Create a struct to return the two vectors
struct Histogram 
{
    std::vector<int> bin_counts;
    std::vector<double> bin_maxes;
};

// Populate an array of data_count size with values between min_meas and max_meas
std::vector<float> populateArray(int data_count, float min_meas, float max_meas) 
{
    std::vector<float> data(data_count);
    srand(RANDOM_SEED);

    for (int i = 0; i < data_count; i++) 
    {
        float random_value = min_meas + static_cast<float>(rand()) / RAND_MAX * (max_meas - min_meas);
        data[i] = random_value;
    }

    return data;
}

int main(int argc, char* argv[]) 
{
    MPI_Init(&argc, &argv);

    int rank, size;

    // Get process rank and total number of processes
    MPI_Comm_rank(MPI_COMM_WORLD, &rank); 
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int num_bins, data_count;
    float min_meas, max_meas;
    std::vector<float> data;

    // Process 0 reads inputs and generates data
    if (rank == 0) 
    {
        if (argc != 5) 
        {
            std::cout << "Requires 5 arguments" << std::endl;
            MPI_Abort(MPI_COMM_WORLD, 1);
        }

        num_bins = std::atoi(argv[1]);
        min_meas = std::atof(argv[2]);
        max_meas = std::atof(argv[3]);
        data_count = std::atoi(argv[4]);
        
        data = populateArray(data_count, min_meas, max_meas);
    }

    // Broadcast parameters to all processes
    MPI_Bcast(&num_bins, 1, MPI_INT, 0, MPI_COMM_WORLD);
    MPI_Bcast(&min_meas, 1, MPI_FLOAT, 0, MPI_COMM_WORLD);
    MPI_Bcast(&max_meas, 1, MPI_FLOAT, 0, MPI_COMM_WORLD);
    MPI_Bcast(&data_count, 1, MPI_INT, 0, MPI_COMM_WORLD);

    // Step 2: Distribute data to all processes using Scatterv
    int chunk_size = data_count / size;
    int remainder = data_count % size;

    std::vector<int> sendcounts(size);
    std::vector<int> displs(size);

    int offset = 0;
    for (int i = 0; i < size; ++i) 
    {
        sendcounts[i] = chunk_size + (i < remainder ? 1 : 0);
        displs[i] = offset;
        offset += sendcounts[i];
    }

    std::vector<float> local_data(sendcounts[rank]);

    MPI_Scatterv(data.data(), sendcounts.data(), displs.data(), MPI_FLOAT, 
                 local_data.data(), sendcounts[rank], MPI_FLOAT, 0, MPI_COMM_WORLD);

    // Step 3: Compute local bin counts
    float bin_width = (max_meas - min_meas) / num_bins;
    std::vector<int> local_bin_counts(num_bins, 0);

    for (float val : local_data) {
        int bin_index = (val - min_meas) / bin_width;
        if (bin_index >= num_bins) bin_index = num_bins - 1;
        local_bin_counts[bin_index]++;
    }

    // Step 4: Reduce bin counts to process 0
    std::vector<int> global_bin_counts(num_bins, 0);
    MPI_Reduce(local_bin_counts.data(), global_bin_counts.data(), num_bins, MPI_INT, MPI_SUM, 0, MPI_COMM_WORLD);

    // Step 5: Print result in process 0
    if (rank == 0) {
        std::cout << "MPI Reduction Sum" << std::endl;

        // Compute bin maxes
        std::vector<double> bin_maxes;
        for (int i = 0; i < num_bins; i++) {
            bin_maxes.push_back(min_meas + ((i + 1) * bin_width));
        }

        std::cout << "bin_maxes =";
        for (auto bin_max : bin_maxes) {
            std::cout << " " << bin_max;
        }
        std::cout << std::endl;

        std::cout << "bin_counts =";
        for (auto bin : global_bin_counts) {
            std::cout << " " << bin;
        }
        std::cout << std::endl;
    }

    MPI_Finalize();
    return 0;
}