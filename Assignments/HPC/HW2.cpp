#include <iostream>
#include <cstdlib>
#include <ctime>
#include <vector>
#include <thread>
#include <mutex>

#include <string>

std::mutex bin_mutex;

int RANDOM_SEED = 100;

struct Histogram {
    std::vector<int> bin_counts;
    std::vector<double> bin_maxes;
};

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

void computeHistogramGlobalSumThread(std::vector<float>& data, int start, int end, int num_bins, float min_meas, float bin_width, std::vector<int>& bin_counts)
{
    for (int i = start; i < end; i++) {
        float val = data[i];

        int bin_index = (val - min_meas) / bin_width;
        if (bin_index >= num_bins) 
        {
            bin_index = num_bins - 1;
        }

        std::lock_guard<std::mutex> lock(bin_mutex);
        bin_counts[bin_index]++;
    }
}

Histogram computeHistogramGlobalSum(int num_bins, int num_threads, std::vector<float> data, float min_meas, float max_meas)
{
    int data_count = data.size();
    float bin_width = (max_meas - min_meas) / num_bins;

    std::vector<int> bin_counts;
    std::vector<double> bin_maxes;

    bin_counts.assign(num_bins, 0);
    for (int i = 0; i < num_bins; i++)
    {
        bin_maxes.push_back(min_meas + ((i + 1) * bin_width));
    }
    

    std::vector<std::thread> threads;
    int chunk_size =  data_count / num_threads;

    for (int i = 0; i < num_threads; i++)
    {
        int start = i * chunk_size;
        int end = (i == num_threads - 1) ? data_count : start + chunk_size;

        threads.emplace_back(computeHistogramGlobalSumThread, std::ref(data), start, end, num_bins, min_meas, bin_width, 
                     std::ref(bin_counts));
    }

    for (auto& t : threads) {
        t.join();
    }

    Histogram out_hist;
    out_hist.bin_counts = bin_counts;
    out_hist.bin_maxes = bin_maxes;

    return out_hist;
}

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

    for (int j = 0; j < local_bin_counts.size(); j++)
    {
        std::string out = "bin " + std::to_string(j) + " = " + std::to_string(local_bin_counts[j]);
        std::cout << out << std::endl;
    }
}

Histogram computeHistogramTreeSum(int num_bins, int num_threads, const std::vector<float>& data, float min_meas, float max_meas) 
{
    int data_count = data.size();
    float bin_width = (max_meas - min_meas) / num_bins;

    std::vector<std::vector<int>> thread_bin_counts(num_threads, std::vector<int>(num_bins, 0));
    std::vector<double> bin_maxes;

    for (int i = 0; i < num_bins; i++)
    {
        bin_maxes.push_back(min_meas + ((i + 1) * bin_width));
    }

    std::vector<std::thread> threads;
    int chunk_size = data_count / num_threads;

    for (int i = 0; i < num_threads; i++) 
    {
        int start = i * chunk_size;
        int end = (i == num_threads - 1) ? data_count : start + chunk_size;

        threads.emplace_back(computeHistogramThreadTree, std::ref(data), start, end, num_bins, min_meas, bin_width, 
                             std::ref(thread_bin_counts[i]));
    }

    for (auto& t : threads) 
    {
        t.join();
    }

    while (num_threads > 1) 
    {
        int new_num_threads = (num_threads + 1) / 2;

        std::vector<std::thread> merge_threads;

        for (int i = 0; i < new_num_threads; i++) {
            int t1 = 2 * i;
            int t2 = t1 + 1;
            if (t2 < num_threads) 
            {
                merge_threads.emplace_back([&](int t1, int t2) 
                {
                    for (int b = 0; b < num_bins; b++) 
                    {
                        thread_bin_counts[t1][b] += thread_bin_counts[t2][b];
                    }
                }, t1, t2);
            }
        }

        for (auto& t : merge_threads) 
        {
            t.join();
        }

        num_threads = new_num_threads;
    }

    Histogram out_hist;
    out_hist.bin_counts = thread_bin_counts[0];
    out_hist.bin_maxes = bin_maxes;

    return out_hist;
}

int main(int argc, char* argv[]) 
{   
    if (argc != 6)
    {
        std::cout << "Requires 6 arguments" << std::endl;
        return 1;
    }

    auto num_threads = std::atoi(argv[1]);
    auto bin_count = std::atoi(argv[2]);
    auto min_meas = std::atof(argv[3]);
    auto max_meas = std::atof(argv[4]);
    auto data_count = std::atoi(argv[5]);

    auto data = populateArray(data_count, min_meas, max_meas);

    auto histogram_global_sum = computeHistogramGlobalSum(bin_count, num_threads, data, min_meas, max_meas);
    auto histogram_tree_sum = computeHistogramTreeSum(bin_count, num_threads, data, min_meas, max_meas);

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
    std::cout << "Global sum total: " << gsTotal << std::endl;
    int trTotal = 0;
    for (auto bin : histogram_tree_sum.bin_counts)
    {
        trTotal += bin;
    }
    std::cout << "Tree sum total: " << trTotal << std::endl;

    return 0;
}

// bin 0 = 4
// bin 0 = 4
// bin 1 = 4
// bin 2 = 3
// bin 3 = 3
// bin 4 = 3
// bin 5 = 3
// bin 6 = 0
// bin 7 = 2
// bin 8 = 1
// bin 9 = 2
// bin 0 = 2
// bin 1 = 2
// bin 2 = 1
// bin 3 = 7
// bin 4 = 1
// bin 5 = 5
// bin 6 = 2
// bin 7 = 2
// bin 0 = 3
// bin 1 = 0
// bin 2 = 2
// bin 3 = 4
// bin 4 = 3
// bin 5 = 4
// bin 6 = 4
// bin 7 = 3
// bin 8 = 1
// bin 9 = 1
// bin 8 = 1
// bin 9 = 2
// bin 1 = 5
// bin 2 = 2
// bin 3 = 3
// bin 4 = 2
// bin 5 = 3
// bin 6 = 1
// bin 7 = 4
// bin 8 = 0
// bin 9 = 1