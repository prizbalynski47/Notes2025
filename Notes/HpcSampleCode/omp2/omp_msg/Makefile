all: omp_msgps omp_msglk

omp_msgps: omp_msgps.o queue.o
	gcc -o omp_msgps omp_msgps.o queue.o -fopenmp

omp_msglk: omp_msglk.o queue_lk.o
	gcc -o omp_msglk omp_msglk.o queue_lk.o -fopenmp

queue.o: queue.c
	gcc -c queue.c

queue_lk.o: queue_lk.c
	gcc -c queue_lk.c

omp_msgps.o: omp_msgps.c
	gcc -c omp_msgps.c

omp_msglk.o: omp_msglk.c
	gcc -c omp_msglk.c

clean:
	rm *.o