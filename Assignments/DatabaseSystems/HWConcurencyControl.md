## 20.22 
Which of the following schedules is (conflict) serializable? For each serializable schedule, determine the equivalent serial schedules.
<ol type="a">
    <li>r<sub>1</sub>(X); r<sub>3</sub>(X); w<sub>1</sub>(X); r<sub>2</sub>(X); w<sub>3</sub>(X);</li>
    <li>r<sub>1</sub>(X); r<sub>3</sub>(X); w<sub>3</sub>(X); w<sub>1</sub>(X); r<sub>2</sub>(X);</li>
    <li>r<sub>3</sub>(X); r<sub>2</sub>(X); w<sub>3</sub>(X); r<sub>1</sub>(X); w<sub>1</sub>(X);</li>
    <li>r<sub>3</sub>(X); r<sub>2</sub>(X); r<sub>1</sub>(X); w<sub>3</sub>(X); w<sub>1</sub>(X);</li>
</ol>
##20.23
Consider the three transactions T<sub>1</sub>, T<sub>2</sub>, and T<sub>3</sub>, and the schedules S<sub>1</sub> and S<sub>2</sub> given below. Draw the serializability (precedence) graphs for S<sub>1</sub> and S<sub>2</sub>, and state whether each schedule is serializable or not. If a schedule is serializable, write down the equivalent serial schedule(s).

- T<sub>1</sub>: r<sub>1</sub>(X); r<sub>1</sub>(Z); w<sub>1</sub>(X); 
- T<sub>2</sub>: r<sub>2</sub>(Z); r<sub>2</sub>(Y); w<sub>z</sub>(Z); w<sub>2</sub>(Y);  
- T<sub>3</sub>: r<sub>1</sub>(X); r<sub>3</sub>(Y); w<sub>3</sub>(Y); 
- S<sub>1</sub>: r<sub>1</sub>(X); r<sub>2</sub>(Z); w<sub>1</sub>(X); 