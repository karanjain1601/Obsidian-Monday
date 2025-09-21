Suppose that we analyze an algorithm and decide that it has the following relationship between the input size, `n`, and the number of operations needed to carry out the algorithm:

N=n2+5N=n2+5

Where nn is the input size and NN is the number of operations required.

For example, if we gave this algorithm an input of 22, the number of required operations would be 22+522+5 or simply 99.

The thing to notice in the above exercise, is this: In n2+5n2+5, the 55 has very little impact on the total [[efficiency]]—especially as the input size gets larger and larger. Asking the computer to do 10,005 operations vs. 10,000 operations makes little difference. Thus, it is the n2n2 that we really care about the most, and the +5+5 makes little difference.

Most of the time, when analyzing the [[efficiency]] of an algorithm, the most important thing to know is the _order_. In other words, we care a lot whether the algorithm's time-complexity has a _linear_ order or a _quadratic_ order (or some other order). This means that very often (in fact, most of the time) when you are asked to analyze an algorithm, you can do so by making an _approximation_ that significantly simplifies things. In this next video, Brynn will discuss this concept and show how it's used with [[Big O Notation]].