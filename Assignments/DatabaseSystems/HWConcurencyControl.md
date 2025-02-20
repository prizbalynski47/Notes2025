## 20.22 
Which of the following schedules is (conflict) serializable? For each serializable schedule, determine the equivalent serial schedules.
<ol type="a">
    <li>r<sub>1</sub>(X); r<sub>3</sub>(X); w<sub>1</sub>(X); r<sub>2</sub>(X); w<sub>3</sub>(X);</li> Not serializable
    <li>r<sub>1</sub>(X); r<sub>3</sub>(X); w<sub>3</sub>(X); w<sub>1</sub>(X); r<sub>2</sub>(X);</li> Not serializable
    <li>r<sub>3</sub>(X); r<sub>2</sub>(X); w<sub>3</sub>(X); r<sub>1</sub>(X); w<sub>1</sub>(X);</li> T<sub>2</sub> &rarr; T<sub>3</sub> &rarr; T<sub>1</sub>
    <li>r<sub>3</sub>(X); r<sub>2</sub>(X); r<sub>1</sub>(X); w<sub>3</sub>(X); w<sub>1</sub>(X);</li> Not serializable
</ol>

## 20.23

Consider the three transactions T<sub>1</sub>, T<sub>2</sub>, and T<sub>3</sub>, and the schedules S<sub>1</sub> and S<sub>2</sub> given below. Draw the serializability (precedence) graphs for S<sub>1</sub> and S<sub>2</sub>, and state whether each schedule is serializable or not. If a schedule is serializable, write down the equivalent serial schedule(s).

- T<sub>1</sub>: r<sub>1</sub>(X); r<sub>1</sub>(Z); w<sub>1</sub>(X); 
- T<sub>2</sub>: r<sub>2</sub>(Z); r<sub>2</sub>(Y); w<sub>2</sub>(Z); w<sub>2</sub>(Y);  
- T<sub>3</sub>: r<sub>3</sub>(X); r<sub>3</sub>(Y); w<sub>3</sub>(Y); 
- S<sub>1</sub>: r<sub>1</sub>(X); r<sub>2</sub>(Z); r<sub>1</sub>(Z); r<sub>3</sub>(X); r<sub>3</sub>(Y); w<sub>1</sub>(X); w<sub>3</sub>(Y); r<sub>2</sub>(Y); w<sub>2</sub>(Z); w<sub>2</sub>(Y);

<img src=images\20.23.1.png>

T<sub>3</sub> &rarr; T<sub>1</sub> &rarr; T<sub>2</sub>
- S<sub>2</sub>: r<sub>1</sub>(X); r<sub>2</sub>(Z); r<sub>3</sub>(X); r<sub>1</sub>(Z); r<sub>2</sub>(Y); r<sub>3</sub>(Y); w<sub>1</sub>(X); w<sub>2</sub>(Z); w<sub>3</sub>(Y); w<sub>2</sub>(Y);

<img src=images\20.23.2.png>

## 21.25

Apply the timestamp ordering algorithm to the schedules in Figures 20.8(b) and (c), and determine whether the algorithm will allow the execution of the schedules.

(b)
| T1 | T2 | T3 | Conflict?  | RTS/WTS Updates |
|----|----|----|------------|-----------------|
|    | rZ |    | No         | RTS(Z) = 2      |
|    | rY |    | No         | RTS(Y) = 2      |
|    | wY |    | No         | WTS(Y) = 2      |
|    |    | rY | 3 > 2 No   | RTS(Y) = 3      |
|    |    | rZ | 3 > 0 No   | RTS(Z) = 3      |
| rX |    |    | No         | RTS(X) = 1      |
| wX |    |    | No         | WTS(X) = 1      |
|    |    | wY | 3 > 2 No   | WTS(Y) = 3      |
|    |    | wZ | 3 > 0 No   | WTS(Z) = 3      |
|    | rX |    | 2 > 1 No   | RTS(X) = 2      |
| rY |    |    | 1 < 3 Yes  |                 |
| wY |    |    | T1 aborted |                 |
|    | wX |    | 2 > 1 No   | WTS(X) = 2      |

(c)
| T1 | T2 | T3 | Conflict?  | RTS/WTS Updates |
|----|----|----|------------|-----------------|
|    |    | rY | No         | RTS(Y) = 3      |
|    |    | rZ | No         | RTS(Z) = 3      |
| rX |    |    | No         | RTS(X) = 1      |
| wX |    |    | No         | WTS(X) = 1      |
|    |    | wY | 3 > 0 No   | WTS(Y) = 3      |
|    |    | wZ | 3 > 0 No   | WTS(Z) = 3      |
|    | rZ |    | 2 < 3 Yes  |                 |
| rY |    |    | 1 < 3 Yes  |                 |
| wY |    |    | T1 aborted |                 |
|    | rY |    | T2 aborted |                 |
|    | wY |    | T2 aborted |                 |
|    | rX |    | T2 aborted |                 |
|    | wX |    | T2 aborted |                 |

## 21.27

Why is two-phase locking not used as a concurrency control method for indexes such as B<sup>+</sup>-trees?

 - It can lead to deadlocks.

 ## 22.21

 Suppose that the system crashes before the [read_item, t<sub>3</sub>, A] entry is written to the log in Figure 22.1(b). Will that make any difference in the recovery process?

 No, it will still have to roll back the same transactions because T<sub>3</sub> still hasn't reached its commit point and T<sub>2</sub> still read the value of B written by T<sub>3</sub>

 ## 22.22

Suppose that the system crashes before the [write_item, T<sub>2</sub>, D, 25, 26] entry is written to the log in Figure 22.1(b). Will that make any difference in the recovery process?

T<sub>2</sub> and T<sub>3</sub> will still both be rolled back, but T<sub>2</sub> will roll back because it didn't reach its own commit point, not just because it reads a value written by T<sub>3</sub>.

 ## 22.23

Figure 22.6 shows the log corresponding to a particular schedule at the point of a system crash for four transactions T<sub>1</sub>, T<sub>2</sub>, T<sub>3</sub>, and T<sub>4</sub>. Suppose that we use the immediate update protocol with checkpointing. Describe the recovery process from the system crash. Specify which transactions are rolled back, which operations in the log are redone and which (if any) are undone, and whether any cascading rollback takes place.

T<sub>1</sub> and T<sub>4</sub> both fully ran and committed, so they don't need to be rolled back at all. T<sub>2</sub> and T<sub>3</sub> both did not reach their commit points, so their transactions will be rolled back. However neither one of them read or wrote to any uncommited values, so their operations can all just be redone as normal.
