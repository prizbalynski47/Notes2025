cmake_minimum_required(VERSION 3.9) # setting this is required
project(example_project)            # this sets the project name

###############################################################################
## file globbing ##############################################################
###############################################################################

# These instructions search the directory tree when cmake is
# invoked and put all files that match the pattern in the variables 
# `sources` and `data`.
# file(GLOB_RECURSE sources      src/main/*.cpp src/main/*.h)
# You can use set(sources src/main.cpp) etc if you don't want to
# use globbing to find files automatically.

###############################################################################
## target definitions #########################################################
###############################################################################

# Target omp_msgps
add_executable(omp_msgps src/omp_msgps.c src/queue.c)
# Just for example add some compiler flags.
target_compile_options(omp_msgps PUBLIC -Wall -fopenmp)
# This allows to include files relative to the root of the src directory with a <> pair
target_include_directories(omp_msgps PUBLIC include)

# Target omp_msglk
add_executable(omp_msglk src/omp_msglk.c src/queue_lk.c)
# Just for example add some compiler flags.
target_compile_options(omp_msglk PUBLIC -Wall -fopenmp)
# This allows to include files relative to the root of the src directory with a <> pair
target_include_directories(omp_msglk PUBLIC include)

###############################################################################
## dependencies ###############################################################
###############################################################################

find_package(OpenMP)
if(OpenMP_CXX_FOUND)
    target_link_libraries(omp_msgps PUBLIC OpenMP::OpenMP_CXX)
    target_link_libraries(omp_msglk PUBLIC OpenMP::OpenMP_CXX)
endif()

