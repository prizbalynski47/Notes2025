## 1.

- Private Variables: i, j, count
- Shared Variables: a, n, temp


## 2.

- You could use an openMP parallel for in the following way:

    `#pragma omp parallel for`

    `for (int i = 0; i < n; i++) {a[i] = temp[i];}`

## ChatGPT

I used ChatGPT to fix an error I was getting with malloc due to using cpp rather than c like the original function was written in. I probably should have just used c, but here we are.