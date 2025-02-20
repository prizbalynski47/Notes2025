#include <stdlib.h>
#include <string.h>
#include <omp.h>
#include <iostream>

void Usage(char prog_name[]);

void count_sort(int a[], int n) {
    int i, j, count;
    int *temp = (int*) malloc(n * sizeof(int));

    for (i = 0; i < n; i++) {
        count = 0;
        for (j = 0; j < n; j++)
            if (a[j] < a[i])
                count++;
            else if (a[j] == a[i] && j < i)
                count++;
        temp[count] = a[i];
    }

    memcpy(a, temp, n * sizeof(int));
    free(temp);
}

void parallel_count_sort(int a[], int n, int thread_count) {
    int *temp = (int*) malloc(n * sizeof(int));

    // Creates thread_count threads to execute concurrently
    # pragma omp parallel num_threads(thread_count)
    {
        int *private_temp = (int*) malloc(n * sizeof(int));

        // Splits the loop among the threads
        # pragma omp for num_threads(thread_count)
        for (int i = 0; i < n; i++) {
            int count = 0;
            for (int j = 0; j < n; j++) {
                if (a[j] < a[i])
                    count++;
                else if (a[j] == a[i] && j < i)
                    count++;
            }
            private_temp[count] = a[i];
        }

        // Protects temp[] from simultaneous writes
        # pragma omp critical
        {
            for (int k = 0; k < n; k++) {
                if (private_temp[k] != 0)
                    temp[k] = private_temp[k];
            }
        }

        free(private_temp);
    }

    // Parallelizes copying temp to the original array
    # pragma omp parallel for num_threads(thread_count)
    for (int i = 0; i < n; i++) {
        a[i] = temp[i];
    }

    free(temp);
}

int main(int argc, char* argv[]) {
    int thread_count, n, i;

    if (argc != 3) Usage(argv[0]);
    thread_count = strtol(argv[1], NULL, 10);
    n = strtol(argv[2], NULL, 10);

    srand(100);

    int* array = new int[n];

    for (int i = 0; i < n; i++) {
        int val = (rand() % n) + 1;
        array[i] = val;
    }

    std::cout << "Original: ";

    for (int i = 0; i < n; i++)
    {
        std::cout << array[i] << " ";
    }
    
    parallel_count_sort(array, n, thread_count);
    
    std::cout << std::endl << "Sorted: ";

    for (int i = 0; i < n; i++)
    {
        std::cout << array[i] << " ";
    }

    delete[] array;
    return 0;
}

void Usage(char prog_name[]) {
    fprintf(stderr, "usage:  %s <thread count> <n>\n",
          prog_name);
    exit(0);
 }  /* Usage */