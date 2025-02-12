#include <iostream>
#include <cstdlib>
#include <ctime>
#include <vector>
#include <thread>
#include <string>
#include <fstream>

// Allows me to switch between the described command line interface and recording timings
#define TIMINGS 0;

// Set the random seed
int RANDOM_SEED = 100;

// Create a struct to return the two vectors
struct Histogram {
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

// Assigns values to a global vector of bin counts
void computeHistogramGlobalSumThread(std::vector<float>& data, int start, int end, int num_bins, float min_meas, float bin_width, std::vector<int>& bin_counts)
{
    for (int i = start; i < end; i++) {
        float val = data[i];

        int bin_index = (val - min_meas) / bin_width;
        if (bin_index >= num_bins) 
        {
            bin_index = num_bins - 1;
        }

        bin_counts[bin_index]++;
    }
}

// Computes the histogram and uses a global sum to combine bin counts found by each thread
Histogram computeHistogramGlobalSum(int num_bins, int num_threads, std::vector<float> data, float min_meas, float max_meas)
{
    int data_count = data.size();
    float bin_width = (max_meas - min_meas) / num_bins;

    std::vector<int> bin_counts;
    std::vector<double> bin_maxes;

    // Calculates the bin max for each bin
    bin_counts.assign(num_bins, 0);
    for (int i = 0; i < num_bins; i++)
    {
        bin_maxes.push_back(min_meas + ((i + 1) * bin_width));
    }
    
    // Create threads and call helper function to put values in bins.
    std::vector<std::thread> threads;
    int chunk_size =  data_count / num_threads;

    for (int i = 0; i < num_threads; i++)
    {
        int start = i * chunk_size;
        int end = (i == num_threads - 1) ? data_count : start + chunk_size;

        threads.emplace_back(computeHistogramGlobalSumThread, std::ref(data), start, end, num_bins, min_meas, bin_width, 
                     std::ref(bin_counts));
    }

    // Join threads back together
    for (auto& t : threads) {
        t.join();
    }

    Histogram out_hist;
    out_hist.bin_counts = bin_counts;
    out_hist.bin_maxes = bin_maxes;

    return out_hist;
}

// Creates a local vector of bins counts for the values assigned to an individual thread
void computeHistogramThreadTree(const std::vector<float>& data, int start, int end, int num_bins,
    float min_meas, float bin_width, std::vector<int>& local_bin_counts)
{
    for (int i = start; i < end; i++)
    {
        float val = data[i];

        int bin_index = (val - min_meas) / bin_width;
        if (bin_index >= num_bins) bin_index = num_bins - 1;
        local_bin_counts[bin_index]++;
    }
}

// Computes the histogram and uses a tree sum to combine bin counts found by each thread
Histogram computeHistogramTreeSum(int num_bins, int num_threads, const std::vector<float>& data, float min_meas, float max_meas) 
{
    int data_count = data.size();
    float bin_width = (max_meas - min_meas) / num_bins;

    std::vector<std::vector<int>> thread_bin_counts(num_threads, std::vector<int>(num_bins, 0));
    std::vector<double> bin_maxes;

    // Calculates the bin max for each bin
    for (int i = 0; i < num_bins; i++)
    {
        bin_maxes.push_back(min_meas + ((i + 1) * bin_width));
    }

    std::vector<std::thread> threads;
    int chunk_size = data_count / num_threads;

    // Create threads and call helper function to put values in bins.
    for (int i = 0; i < num_threads; i++) 
    {
        int start = i * chunk_size;
        int end = (i == num_threads - 1) ? data_count : start + chunk_size;

        threads.emplace_back(computeHistogramThreadTree, std::ref(data), start, end, num_bins, min_meas, bin_width, 
                             std::ref(thread_bin_counts[i]));
    }

    // Join threads back together
    for (auto& t : threads) 
    {
        t.join();
    }

    int modulator = 1;
    int prev_modulator;

    // This while loop is the tree sum
    while (modulator <= num_threads)
    {
        prev_modulator = modulator;
        modulator *= 2;

        
        std::vector<std::thread> merge_threads;
        
        for (int i = 0; i < num_threads; i += modulator)
        {
            merge_threads.emplace_back([&, i, prev_modulator](){
                for (int j = 0; j < num_bins; j++)
                {
                    // I had to add this section because there would sometimes be issues with
                    // trying to add a thread's bin count that didn't exist if the number of
                    // threads wasn't a perfect square
                    if (i + prev_modulator < thread_bin_counts.size())
                    {
                        thread_bin_counts[i][j] += thread_bin_counts[i+prev_modulator][j];
                    }
                }
            });
        }
        
        for (auto& t : merge_threads) 
        {
            t.join();
        }
    }
    

    Histogram out_hist;
    out_hist.bin_counts = thread_bin_counts[0];
    out_hist.bin_maxes = bin_maxes;

    return out_hist;
}

int main(int argc, char* argv[]) 
{
    // Code to measure timings and save to timing result.csv
    // Only runs if TIMINGS is defined as 1 at top of file
    #if TIMINGS
    {
        if (argc != 5)
        {
            std::cout << "Requires 5 arguments" << std::endl;
            return 1;
        }

        auto bin_count = std::atoi(argv[1]);
        auto min_meas = std::atof(argv[2]);
        auto max_meas = std::atof(argv[3]);
        auto data_count = std::atoi(argv[4]);

        auto data = populateArray(data_count, min_meas, max_meas);

        std::vector<int> thread_counts;
        std::vector<double> global_sum_times;
        std::vector<double> tree_sum_times;

        for (int num_threads = 1; num_threads <= 8; num_threads++)
        {
            thread_counts.push_back(num_threads);

            auto start = std::chrono::high_resolution_clock::now();
            auto histogram_global_sum = computeHistogramGlobalSum(bin_count, num_threads, data, min_meas, max_meas);
            auto end = std::chrono::high_resolution_clock::now();
            std::chrono::duration<double> elapsed = end - start;
            global_sum_times.push_back(elapsed.count());

            start = std::chrono::high_resolution_clock::now();
            auto histogram_tree_sum = computeHistogramTreeSum(bin_count, num_threads, data, min_meas, max_meas);
            end = std::chrono::high_resolution_clock::now();
            elapsed = end - start;
            tree_sum_times.push_back(elapsed.count());

            std::cout << "Threads: " << num_threads 
                    << " | Global Sum Time: " << global_sum_times.back() 
                    << "s | Tree Sum Time: " << tree_sum_times.back() << "s\n";
        }

        std::ofstream file("timing_results.csv");
        file << "Threads,GlobalSumTime,TreeSumTime\n";
        for (size_t i = 0; i < thread_counts.size(); i++) {
            file << thread_counts[i] << "," << global_sum_times[i] << "," << tree_sum_times[i] << "\n";
        }
        file.close();
    } 
    #else
    // Regular command line actions for the program 
    {
        // Checks for correct number of arguments
        if (argc != 6)
        {
            std::cout << "Requires 6 arguments" << std::endl;
            return 1;
        }

        // Setting arguments to variables
        auto num_threads = std::atoi(argv[1]);
        auto bin_count = std::atoi(argv[2]);
        auto min_meas = std::atof(argv[3]);
        auto max_meas = std::atof(argv[4]);
        auto data_count = std::atoi(argv[5]);

        // Calling functions from above to make the array and create the histograms
        auto data = populateArray(data_count, min_meas, max_meas);
        auto histogram_global_sum = computeHistogramGlobalSum(bin_count, num_threads, data, min_meas, max_meas);
        auto histogram_tree_sum = computeHistogramTreeSum(bin_count, num_threads, data, min_meas, max_meas);

        // Printing out the output
        std::cout << "Global Sum" << std::endl;
        std::cout << "bin_maxes =";
        for (auto bin_max : histogram_global_sum.bin_maxes)
        {
            std::cout << " " << bin_max;
        }
        std::cout << std::endl;
        std::cout << "bin_counts =";
        for (auto bin : histogram_global_sum.bin_counts)
        {
            std::cout << " " << bin;
        }
        std::cout << std::endl << std::endl;
        
        std::cout << "Tree Sum" << std::endl;
        std::cout << "bin_maxes =";
        for (auto bin_max : histogram_tree_sum.bin_maxes)
        {
            std::cout << " " << bin_max;
        }
        std::cout << std::endl;
        std::cout << "bin_counts =";
        for (auto bin : histogram_tree_sum.bin_counts)
        {
            std::cout << " " << bin;
        }
        std::cout << std::endl << std::endl;
        int gsTotal = 0;
        for (auto bin : histogram_global_sum.bin_counts)
        {
            gsTotal += bin;
        }
    }
    #endif

    return 0;
}